<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>诺机销售后台管理系统</h2>
        <p>
          一款手机销售后台管理系统，可以用于所有的Web应用程序，如网站管理后台，网站用户中心，销售管理等等。
        </p>
        <p>
          <b>当前版本:</b> <span>v2.1.0</span>
        </p>
        <p>
          <el-tag>致宇数据BU-杨寅</el-tag>
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot 2.3.3.RELEASE</li>
              <li>MyBatis-Plus 3.4.2</li>
              <li>Fastjson 1.2.83</li>
              <li>HuTool 5.0.6</li>
              <li>Lombok 1.18.24</li>
              <li>Mapstruct 1.5.0.RC1</li>
              <li>Druid 1.1.10</li>
              <li>Quartz</li>
              <li>RuoYi</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue3</li>
              <li>Element-Plus</li>
              <li>webpack</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />

  </div>
</template>

<script setup name="Index">
const version = ref('3.8.5')

function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

