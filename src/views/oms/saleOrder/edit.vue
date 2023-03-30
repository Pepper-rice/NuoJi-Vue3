<template>
  <div class="app-container">
    <el-form :model="saleOrderForm" :rules="saleOrderFormRules" ref="saleOrderForm" label-width="160px" class="demo-ruleForm" label-position="right">
      <el-row>
        <el-input type="hidden" v-model="saleOrderForm.id" disabled></el-input>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="销售单编号" prop="sn">
            <el-input v-model="saleOrderForm.sn" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户" prop="customerId">
            <el-select v-model="saleOrderForm.customerId" :disabled="disable" clearable filterable placeholder="请选择客户">
              <el-option
                v-for="dict in customerOptions"
                :key="dict.id"
                :label="dict.customerName"
                :value="dict.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户地址">
            <el-input type="text" v-model="saleOrderForm.address" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单据日期">
            <el-form-item prop="billDate">
              <el-date-picker clearable type="date"  value-format="yyyy-MM-dd" placeholder="选择日期" v-model="saleOrderForm.billDate" :disabled="disable"></el-date-picker>
            </el-form-item>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="saleOrderForm.remark" :disabled="disable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="商品信息">
        <el-button type="primary" icon="el-icon-plus" plain size="mini" @click="selectInventoryProducts" v-if="!disable">选择商品</el-button>
        <el-dialog  :visible.sync="open" title="库存商品列表" width="800px">
          <SelectInventory v-on:inventoryProductList="getInventoryProductList"/>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="enterSelectInventory">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
        <el-table
          show-summary :summary-method="getSummaries"
          :data="saleOrderForm.saleOrderItemList"
          style="width: 100%; margin: 15px 0 0 0;"  stripe>
          <el-table-column
            label="商品名称"
            prop="product.productName">
            <template slot-scope="scope">
              <span>{{scope.row.product.productName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品规格"
            prop="productSku.specifications">
            <template slot-scope="scope">
              <span>{{scope.row.productSku.specifications}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品条码"
            prop="productSku.barCode">
            <template slot-scope="scope">
              <span>{{scope.row.productSku.barCode}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="销售单价(元)"
            prop="price">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.price" :disabled="disable"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="销售数量"
            prop="saleQty">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.saleQty" :disabled="disable"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="销售金额(元)"
            prop="amount">
            <template slot-scope="scope">
              {{ scope.row.amount = multiply(scope.row, scope.$index)}}
            </template>
          </el-table-column>
          <el-table-column
            label="库存数量">
            <template slot-scope="scope">
              <span>{{scope.row.inventory.qty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品单位"
            prop="product.unit">
            <template slot-scope="scope">
              <span>{{unitFormat(scope.row.product.unit)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="仓库">
            <template slot-scope="scope">
              <span>{{scope.row.warehouse.warehouseName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            v-if="!disable">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" plain icon="el-icon-delete"   @click.native="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="margin-top: 100px" v-if="!disable">
        <el-button type="primary" @click="submitForm('saleOrderForm')">保存</el-button>
        <el-button @click="resetForm('saleOrderForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getSaleOrder, saveSaleOrder } from "@/api/oms/saleOrder";
import { listAllCustomer } from "@/api/oms/customer";
import SelectInventory from "../../../components/inventory";

export default {
  name: "SaleOrderEdit",
  components: {SelectInventory},
  data() {
    return {
      showEdit: [], //显示编辑框
      showBtn: [],
      search: '',
      // 当未出库都可以操作
      disable: false,
      // 供应商
      customerOptions: [],
      //单位
      unitOptions: [],
      // 默认关闭
      open: false,
      // 库存商品列表
      inventoryProductList:[],
      saleOrderForm: {},
      saleOrderFormRules: {
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    const id = this.$route.params.id
    if(id) {
      getSaleOrder(id).then(response => {
        this.msgSuccess("获取数据成功");
        this.saleOrderForm = response.data
        if (this.saleOrderForm.inventoryStatus == 2) {
          this.disable = true
        }
      });
    }
    // 查询客户信息
    listAllCustomer().then(res =>{
      this.customerOptions = res.data
    });
    // 单位字典
    this.getDicts("unit").then(response => {
      this.unitOptions = response.data;
    });
  },
  methods: {
    submitForm() {
      this.$refs.saleOrderForm.validate((valid) => {
        if (valid) {
          saveSaleOrder(this.saleOrderForm).then(res => {
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
    /** 字典状态字典翻译 */
    unitFormat(val) {
      return this.selectDictLabel(this.unitOptions, val);
    },

    // 重置表单
    resetForm(saleOrderForm) {
      this.saleOrderForm.saleOrderItemList = []
      this.$refs.saleOrderForm.resetFields();
    },
    // 选择库存商品
    selectInventoryProducts() {
      this.open = true
    },

    // 获取库存商品列表
    getInventoryProductList(data) {
      console.log("getInventoryProductList", data)
      this.inventoryProductList = data
    },

    // 相乘
    multiply(row,index) {
        if(row.saleQty && row.price){
          row.amount = Number(row.saleQty)*Number(row.price)
        }
        return row.amount
    },

    //自定义统计
    getSummaries(param) {
      const { columns, data } = param;//这里可以看出，自定义函数会传入每一列，以及数据
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        //页面分别统计 处理
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr ;
            } else {
              return prev;
            }
          }, 0);

          //console.log("sums[index]=="+sums[index])
          //此处结合了方式一的判断处理，实现多种条件处理
          switch(column.property) {
            case "amount":
              this.saleOrderForm.totalAmount = sums[index]
              return sums[index];
              break;
            default:
              return sums[index] = '';
              break;
          }
        } else {
          sums[index] = ''; //如果列的值有一项不是数字，就显示这个自定义内容
        }
      });
      return sums;//最后返回合计行的数据
    },

    // 确定选择商品
    enterSelectInventory(){
      let soList  = this.saleOrderForm.saleOrderItemList
      if (!soList) {
        soList = []
        this.saleOrderForm.saleOrderItemList = soList
      }
      this.inventoryProductList.forEach(function (item) {
        const ret = soList.find(saleOrderItem => {
          //从分数组中找每个元素 当总数组元素等于分数组元素
          return (saleOrderItem.skuId === item.skuId && saleOrderItem.productId === item.productSku.productId && saleOrderItem.warehouseId === item.warehouseId)　　　　　　　　　//说明一样 不符合要求
        })
        if (!ret) {
          let o ={product: {}, productSku: {}, warehouse: {}, inventory: {}};
          o.skuId = item.skuId
          o.productId = item.productSku.productId
          o.productSku.id = item.skuId
          o.product.productName = item.product.productName
          o.productSku.specifications = item.productSku.specifications
          o.productSku.barCode = item.productSku.barCode
          o.warehouseId = item.warehouseId
          o.warehouse.warehouseName = item.warehouse.warehouseName
          o.inventory.qty = item.qty
          o.product.unit = item.product.unit
          soList.push(o)
        }
      })
      this.open = false
    },
    // 取消对话框
    cancel(){
      this.open = false;
    },

    //点击删除
    handleDelete(index, row) {
      this.saleOrderForm.saleOrderItemList.splice(index, 1)
    },
    /** 关闭按钮 */
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/sale/order", query: { t: Date.now()}})
    }
  }
}
</script>
