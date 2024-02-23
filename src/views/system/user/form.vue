<template>
  <el-drawer :title="formTitle" v-model="visible" size="60%">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      label-width="82px"
      v-loading="formLoading"
    >
      <el-row :gutter="30">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item :label="$t('user.column.username')" prop="username">
            <el-input
              :disabled="formModel.userId !== ''"
              v-model="formModel.username"
              clearable
              :placeholder="$t('user.tip.username')"
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item :label="$t('user.column.password')" prop="password">
            <el-input
              :disabled="formModel.userId !== ''"
              v-model="formModel.password"
              clearable
              show-password
              :placeholder="$t('user.tip.password')"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item :label="$t('user.column.nickname')" prop="nickname">
            <el-input
              v-model="formModel.nickname"
              clearable
              :placeholder="$t('user.tip.nickname')"
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item :label="$t('user.column.name')" prop="name">
            <el-input
              v-model="formModel.name"
              clearable
              :placeholder="$t('user.tip.name')"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item :label="$t('user.column.sex')">
            <el-radio-group v-model="formModel.sex">
              <el-radio
                v-for="(item, index) in sex"
                :key="index"
                :label="item.value"
                >{{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item :label="$t('user.column.mobile')" prop="mobile">
            <el-input
              v-model="formModel.mobile"
              clearable
              :placeholder="$t('user.tip.mobile')"
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item :label="$t('user.column.email')" prop="email">
            <el-input
              v-model="formModel.email"
              clearable
              :placeholder="$t('user.tip.email')"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item :label="$t('user.column.deptId')" prop="deptId">
            <el-cascader
              class="w-full"
              v-model="formModel.deptId"
              :options="deptTree"
              :props="{
              value: 'deptId',
              label: 'name',
              emitPath: false,
              checkStrictly: true,
              expandTrigger: 'hover' as const
            }"
              clearable
              filterable
              :placeholder="$t('user.tip.deptId')"
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item :label="$t('user.column.post')" prop="postIds">
            <el-select
              v-model="formModel.postIds"
              multiple
              :placeholder="$t('user.tip.post')"
              class="w-full"
            >
              <el-option
                v-for="item in postOptions"
                :key="item.postId"
                :label="item.name"
                :value="item.postId"
              />
            </el-select>
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item :label="$t('user.column.status')">
            <el-switch
              v-model="formModel.status"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
              active-text="正常"
              inactive-text="停用"
            />
          </el-form-item>
        </re-col>

        <re-col>
          <el-form-item :label="$t('user.column.remark')" prop="remark">
            <el-input
              v-model="formModel.remark"
              :placeholder="$t('user.tip.remark')"
              type="textarea"
            />
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import ReCol from "@/components/ReCol";
import { handleTree } from "@/utils/tree";
import { creating, updating, getting } from "@/api/system/user";
import { listSimple } from "@/api/system/dept";
import { listSimple as postListSimple } from "@/api/system/post";
import { getConfig } from "@/api/system/config";
const { t } = useI18n();
const message = useMessage();
const { sex } = useDict("sex");
const formRef = ref();
const deptTree = ref();
const visible = ref(false);
const formTitle = ref("");
const formLoading = ref(false);
const postOptions = ref();

const formModel = reactive({
  userId: undefined,
  deptId: 0,
  username: "",
  password: "",
  nickname: "",
  name: "",
  sex: 0,
  mobile: "",
  email: "",
  status: 1,
  remark: "",
  postIds: [] as number[],
  postList: []
});

// 自定义表单规则校验
const formRules = reactive({
  username: [
    { required: true, message: t("user.required.username"), trigger: "blur" }
  ],
  password: [
    { required: true, message: t("user.required.password"), trigger: "blur" }
  ],
  nickname: [
    { required: true, message: t("user.required.nickname"), trigger: "blur" }
  ],
  status: [
    { required: true, message: t("user.required.status"), trigger: "blur" }
  ],
  email: [
    {
      type: "email",
      message: t("user.message.email"),
      trigger: ["blur", "change"]
    }
  ]
});

// 打开弹框
const openDialog = async (title: string, id?: number) => {
  visible.value = true;
  formTitle.value = title;
  resetForm();
  // 加载使用的数据
  getDeptData();
  getPostData();
  if (id) {
    try {
      formLoading.value = true;
      const { data } = await getting(id);
      if (data.postList) {
        formModel.postIds = data.postList.map(item => item.postId);
      }
      Object.assign(formModel, data);
    } finally {
      formLoading.value = false;
    }
  } else {
    getConfig("SYS_USER_DEFAULT_PASSWORD").then(res => {
      const { data } = res;
      formModel.password = data.value;
    });
  }
};

// 确认按钮
const emit = defineEmits(["refresh"]);
const handleSubmit = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;
  try {
    formLoading.value = true;
    formModel.userId ? await updating(formModel) : await creating(formModel);
    message.success();
    visible.value = false;
    emit("refresh");
  } finally {
    formLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formModel.userId = "";
  formRef.value?.resetFields();
};

// 部门数据
const getDeptData = () => {
  listSimple().then(res => {
    deptTree.value = handleTree(res.data, "deptId");
  });
};

// 岗位数据
const getPostData = () => {
  postListSimple().then(res => {
    postOptions.value = res.data;
  });
};

defineExpose({ openDialog });
</script>
