<template>
  <div class="app-container">
    <el-form
      :model="productForm"
      :rules="productFormRules"
      ref="productForm"
      label-width="160px"
      class="demo-ruleForm"
      label-position="right"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="系统编号" prop="sn">
            <el-input v-model="productForm.sn" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品编码" prop="productCode">
            <el-input v-model="productForm.productCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品名称" prop="productName">
            <el-input v-model="productForm.productName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品类别" prop="productType">
            <treeselect
              v-model="productForm.categoryId"
              :options="categoryOptions"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="请选择商品类别"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="productForm.unit" clearable filterable placeholder="请选择单位">
            <el-option
              v-for="dict in unitOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="商品简介" prop="remark">
          <el-input
            type="textarea"
            v-model="productForm.remark"
            :rows="5"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-form-item label="商品规格" prop="isSpec">
        <el-radio
          v-model="productForm.isSpec"
          :label="false"
          @change="changeSingleSpec"
          :disabled="disabled"
          >单规格</el-radio
        >
        <el-radio
          v-model="productForm.isSpec"
          :label="true"
          @change="changeDoubleSpec"
          :disabled="disabled"
          >多规格</el-radio
        >
      </el-form-item>

      <div v-if="productForm.isSpec">
        <el-form-item label="选择规格">
          <el-select
            v-model="selectSpec"
            multiple
            filterable
            allow-create
            default-first-option
            @change="setSelectSpec"
            placeholder="请选择规格"
          >
            <el-option
              v-for="item in specList"
              :key="item.id"
              :label="item.specName"
              :value="item.specName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则名称">
          <el-tag v-for="item in this.selectSpec" :key="item" type="info">
            {{ item }}
          </el-tag>
          <el-input
            style="width: 100px; margin: 0 15px 0 15px"
            class="input-new-tag"
            v-if="nameInputVisible"
            v-model="nameInputValue"
            ref="saveTagInput"
            size="small"
            label="规格"
            placeholder="请输入规格"
          >
          </el-input>
          <el-input
            style="width: 110px"
            class="input-new-tag"
            v-if="valueInputVisible"
            v-model="valueInputValue"
            ref="saveTagInput"
            size="small"
            label="规格值"
            placeholder="请输入规格值"
          >
          </el-input>
          <el-button
            type="primary"
            v-if="nameInputVisible"
            style="margin: 0 0 0 15px"
            size="mini"
            @click="addSupplier"
            >添加</el-button
          >
          <el-button
            type="primary"
            v-if="nameInputVisible"
            size="mini"
            @click="cancelAddName"
            >取消</el-button
          >
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            style="margin: 0 0 0 15px"
            type="warning"
          >+ 添加新规则
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-row v-for="(item, x) in selectSpec" :key="x">
            <span>{{ item }}</span>
            <el-tag
              v-for="(itemArr, i) in dynamic_spec.filter(
                (dynamic_spec) => dynamic_spec.specName == item
              )[0].specAttr"
              :key="i"
              closable
              @close="
                handleClose(
                  item,
                  dynamic_spec.filter(
                    (dynamic_spec) => dynamic_spec.specName == item
                  )[0],
                  dynamic_spec.filter(
                    (dynamic_spec) => dynamic_spec.specName == item
                  )[0].specAttr,
                  itemArr
                )
              "
            >
              {{ itemArr }}
            </el-tag>
            <el-input
              style="width: 110px; margin: 0 0 0 15px"
              class="input-new-tag"
              v-if="
                dynamic_spec.filter(
                  (dynamic_spec) => dynamic_spec.specName == item
                )[0].inputVisible
              "
              v-model="
                dynamic_spec.filter(
                  (dynamic_spec) => dynamic_spec.specName == item
                )[0].inputValue
              "
              :ref="
                'saveSpecTagInput' +
                dynamic_spec.indexOf(
                  dynamic_spec.filter(
                    (dynamic_spec) => dynamic_spec.specName == item
                  )[0]
                )
              "
              size="small"
              @keyup.enter.native="handleInputConfirm(item)"
              @blur="handleInputConfirm(item)"
              placeholder="请输入属性">
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showSpecInput(item)"
              style="margin: 0 0 0 15px"
              >+ New Tag</el-button>
          </el-row>
        </el-form-item>

        <el-button
          style="margin: 15px 0 0 160px"
          type="primary"
          @click="createNewTable"
          >生成</el-button>
      </div>
      <el-table
        :data="productForm.productSkuList"
        style="width: 80%; margin: 15px 0 0 150px"
        stripe>
        <el-table-column label="商品图片" prop="images">
          <template slot-scope="scope">
            <el-upload
              class="avatar-uploader"
              :action="uploadFileUrl"
              :headers="headers"
              :show-file-list="false"
              :on-success="(res,file) =>{return handleAvatarSuccess(res,file,scope.$index)}"
              :before-upload="beforeAvatarUpload">
              <img v-if="scope.row.images" :src="scope.row.images" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(col, i) in cols"
          :prop="col.prop"
          :label="col.label"
          :key="i">
          <template slot-scope="scope">
            <span>{{ scope.row[col.prop] }}</span
            ><br />
          </template>
        </el-table-column>
        <el-table-column label="商品条码" prop="barCode">
          <template slot-scope="scope">
            <el-input v-model="scope.row.barCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品规格" prop="specifications" v-if="!productForm.isSpec">
          <template slot-scope="scope">
            <el-input v-model="scope.row.specifications"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="零售价格(元)" prop="salePrice">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.salePrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="批发价格(元)" prop="tradePrice">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.tradePrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="VIP价格(元)" prop="vipPrice">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.vipPrice"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item
        ><el-button
          type="primary"
          style="margin: 100px 0 0 0"
          @click="submitForm"
          >提交</el-button>
        <el-button @click="resetForm('productForm')">重置</el-button></el-form-item>
    </el-form>
  </div>
</template>
<script>
import { listSpec } from "@/api/oms/spec";
import { listCategory } from "@/api/oms/category";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
import { getToken } from "@/utils/auth";
import { saveProduct } from "@/api/oms/product";
import { getProduct } from "../../../api/oms/product";
export default {
  name: "productEdit",
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 分类树选项
      categoryOptions: [],
      disabled: false,
      // 单位
      unitOptions:[],
      // sku
      sku: {
        // 图片
        images: "",
        // 规格
        specifications: [],
        // 条码
        productCode: "",
        // 零售价格
        salePrice: 0,
        // 批发价格
        tradePrice: 0,
        // vip价格
        vipPrice: 0,
        // 折扣
        discount1: 0,
        // 预计采购价
        purchasePrice: 0,
        // 备注
        remark: ""
      },
      //获取的规则数据
      specList: [],
      //获取的规则数据动态处理
      dynamic_spec: [],
      // 选择的规则数据
      selectSpec: [],
      nameInputVisible: false,
      nameInputValue: "",
      valueInputVisible: false,
      valueInputValue: "",
      //所有商品的规格值数组
      specArry: [],
      //所有商品的规格值的组合
      totalSpec: [],
      //添加的表头元素
      cols: [],
      // 上传参数
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken()
      },
      // 商品
      productForm: {
        isSpec: false,
        productSkuList: []
      },
      productFormRules: {
        productName: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    const id = this.$route.params.id;

    // 查询商品规格
    listSpec().then((response) => {
      response.rows.forEach((element) => {
        element.inputVisible = false;
        element.inputValue = "";
      });
      this.specList = response.rows;
    });
    // 加载商品类别
    this.getTreeSelect();

    this.productForm.productSkuList.push(this.sku);

    // 单位字典
    this.getDicts("unit").then(response => {
      this.unitOptions = response.data;
    });

    if (id) {
      getProduct(id).then((response) => {
        this.msgSuccess("获取数据成功");
        this.disabled = true;
        this.productForm = response.data;
        this.dynamic_spec = this.productForm.specList;

        this.dynamic_spec.forEach((element, index) => {
          this.cols.push({
            prop: "list" + index,
            label: element.specName
          });
          this.productForm.productSkuList.forEach((element, i) => {
            element["list" + `${index}`] = element.specifications.split("_")[
              index
            ];
          });
        });
        this.dynamic_spec.forEach((item) => {
          this.selectSpec.push(item.specName);
        });
      });

    }
  },
  computed:{

  },
  methods: {
    submitForm() {
      this.$refs.productForm.validate((valid) => {
        if (this.productForm.isSpec) {
          this.productForm.specList = this.dynamic_spec;
        } else {
          this.productForm.specList = [];

          if (
            Array.isArray(this.productForm.productSkuList[0].specifications)
          ) {
            this.productForm.productSkuList[0].specifications = this.productForm.productSkuList[0].specifications.join(
              ""
            );
          }
        }
        if (valid) {
          saveProduct(this.productForm).then((res) => {
            if (res.code === 200) {
              this.msgSuccess(res.msg);
              this.close();
            }
          });
        } else {
          this.msgError("表单校验未通过，请重新检查提交内容");
        }
      });
    },
    // 重置表单
    resetForm(productForm) {
      this.productForm.productSkuList = [];
      this.$refs[productForm].resetFields();
    },
    //点击更新
    handleUpdate(index, row) {
      this.productForm.productSkuList.splice(index, 1, row);
      this.handleCancel(index, row);
    },
    /** 关闭按钮 */
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/product/product", query: { t: Date.now() } });
    },

    // 文件上传成功
    handleAvatarSuccess(res,file,index) {
      this.$set(this.productForm.productSkuList[index],'images',res.data.url);
    },
    // 文件大小验证
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    handlePreview(file) {
      console.log(file);
    },
    setSelectSpec() {
      this.dynamic_spec = JSON.parse(JSON.stringify(this.specList));
      if(this.$route.params.id){
        this.dynamic_spec = this.dynamic_spec.concat(this.productForm.specList);
      }
      console.log(this.dynamic_spec)
      let value = [];
      this.selectSpec.forEach((element) => {
        value.push(
          this.dynamic_spec.filter(
            (dynamic_spec) => dynamic_spec.specName == element
          )[0]
        );
      });

      this.dynamic_spec = [];
      this.dynamic_spec = this.dynamic_spec.concat(value);

    },

    // 联动删除事件
    handleClose(item, delSpec, selectSpecAttr, tag) {
      selectSpecAttr.splice(selectSpecAttr.indexOf(tag), 1);
      if (selectSpecAttr.length == 0) {
        let index = this.selectSpec.indexOf(item);
        if (index != -1) {
          this.selectSpec.splice(index, 1);
        }
        let index_1 = this.dynamic_spec.indexOf(delSpec);
        if (index_1 != -1) {
          this.dynamic_spec.splice(index_1, 1);
        }
      }
      this.cols = [];
      this.productForm.productSkuList = [];
    },
    showInput() {
      this.nameInputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //添加规则名称
    addSupplier() {
      var newValue = {
        specName: this.nameInputValue,
        specAttr: [],
        inputVisible: false,
        inputValue: ""
      };
      if (
        this.specList.filter(
          (specList) => specList.specName == this.nameInputValue
        )[0]
      ) {
        this.$message.error("该规则已存在！");
      } else {
        this.selectSpec.push(this.nameInputValue);
        this.specList.push(newValue);
        this.dynamic_spec.push(newValue);
        this.nameInputVisible = false;
        this.nameInputValue = "";
      }
    },
    showSpecInput(item) {
      let x = this.dynamic_spec.indexOf(
        this.dynamic_spec.filter(
          (dynamic_spec) => dynamic_spec.specName == item
        )[0]
      );
      this.dynamic_spec[x].inputVisible = true;
      let saveSpecTagInputRef = "saveSpecTagInput" + `${x}`;
      this.$nextTick(() => {
        this.$refs[saveSpecTagInputRef][0].$refs.input.focus();
      });
    },
    handleInputConfirm(item) {
      let x = this.dynamic_spec.indexOf(
        this.dynamic_spec.filter(
          (dynamic_spec) => dynamic_spec.specName == item
        )[0]
      );

      let inputValue = this.dynamic_spec[x].inputValue;

      if (inputValue == "") {
        this.$message.error("请输入属性值");
      } else {
        if (
          inputValue &&
          this.dynamic_spec[x].specAttr.filter(
            (specAttr) => specAttr == inputValue
          )[0]
        ) {
          this.$message.error("该属性已存在！");
        } else {
          this.dynamic_spec[x].specAttr.push(inputValue);

          this.dynamic_spec[x].inputVisible = false;
          this.dynamic_spec[x].inputValue = "";
        }
      }
    },
    cancelAddName() {
      this.nameInputVisible = false;
    },
    // 监听多规则
    changeDoubleSpec() {
      this.productForm.productSkuList = [];
    },
    // 监听单规则
    changeSingleSpec() {
      this.productForm.productSkuList = [];
      this.cols = [];
      this.productForm.productSkuList.push(this.sku);
    },
    /** 转换分类数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.categoryName,
        children: node.children
      };
    },
    /** 查询分类下拉树结构 */
    getTreeSelect() {
      listCategory().then((response) => {
        this.categoryOptions = this.handleTree(response.data, "id");
      });
    },

    // 生成表单
    createNewTable() {
      this.specArry = [];
      this.cols = [];
      this.productForm.productSkuList = [];

      if (this.dynamic_spec.length !== 0) {
        this.dynamic_spec.forEach((element, index) => {
          this.specArry.push(element.specAttr);
          this.cols.push({
            prop: "list" + index,
            label: element.specName
          });
        });
        this.totalSpec = this.getCartesian(this.specArry);
        this.totalSpec.forEach((element) => {
          let sku = {};
          this.cols.forEach((item, index) => {
            let element_attr = element.split("_");
            sku[`${item.prop}`] = element_attr[index];
          });
          // 保存到后台的实际规格属性值
          sku.specifications = element;
          this.productForm.productSkuList.push(sku);
        });
      }
    },
    /*多个数组求笛卡尔积*/
    getCartesian(speAttr) {
      // last为上次运算的结果，current为数组中的当前元素
      let result = speAttr.reduce((last, current) => {
        const array = [];
        last.forEach((par1) => {
          current.forEach((par2) => {
            array.push(par1 + "_" + par2);
          });
        });
        return array;
      });
      return result;
    },
  }
};
</script>
<style lang="scss">
.el-steps {
  margin: 15px;
}
.el-tag {
  margin-left: 15px;
}

// 图片上传样式
.disabled .el-upload--picture-card {
    display: none;
    width: 50px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 68px;
  height: 68px;
  line-height: 68px;
  text-align: center;
}
.avatar {
  width: 68px;
  height: 68px;
  display: block;
}


</style>
