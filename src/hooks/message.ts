import { VNode, h } from "vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { GlobalStatus } from "@/utils/constants";

export const useMessage = () => {
  return {
    // 消息提示
    info(content: string, showClose?: boolean) {
      ElMessage({
        showClose: showClose,
        message: content
      });
    },
    // 成功消息
    success(content: string, showClose?: boolean) {
      ElMessage({
        showClose: showClose,
        message: content,
        type: "success"
      });
    },
    // 警告消息
    warning(content: string, showClose?: boolean) {
      ElMessage({
        showClose: showClose,
        message: content,
        type: "warning"
      });
    },
    // 错误消息
    error(content: string, showClose?: boolean) {
      ElMessage({
        showClose: showClose,
        message: content,
        type: "error"
      });
    }
  };
};

type Content = string | VNode;
export const useMessageBox = () => {
  return {
    // 消息提示
    info(content: string) {
      ElMessageBox.alert(content, "系统提示");
    },
    // 成功提示
    success(content: string) {
      ElMessageBox.alert(content, "系统提示", { type: "success" });
    },
    // 警告提示
    warning(content: string) {
      ElMessageBox.alert(content, "系统提示", { type: "warning" });
    },
    // 错误提示
    error(content: string) {
      ElMessageBox.alert(content, "系统提示", { type: "error" });
    },
    // 确认窗体
    confirm(content: Content, title?: string) {
      return ElMessageBox.confirm(content, title ? title : "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      });
    },
    // 状态窗体
    switch(status: number, name?: any) {
      const text = status === GlobalStatus.ENABLE ? "启用" : "停用";
      const c = h("p", null, [
        h("span", null, "确认要"),
        h("span", { style: "color: red" }, text),
        h("span", { style: "color: teal" }, " " + name),
        h("span", null, " 角色吗？")
      ]);
      return this.confirm(c);
    }
  };
};

type Position = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export const usrNotification = () => {
  return {
    // 消息提示
    info(content: string, position?: Position) {
      ElNotification({
        title: "系统提示",
        message: content,
        type: "info",
        position: position
      });
    },
    // 成功提示
    success(content: string, position?: Position) {
      ElNotification({
        title: "系统提示",
        message: content,
        type: "success",
        position: position
      });
    },
    // 警告提示
    warning(content: string, position?: Position) {
      ElNotification({
        title: "系统提示",
        message: content,
        type: "warning",
        position: position
      });
    },
    // 错误提示
    error(content: string, position?: Position) {
      ElNotification({
        title: "系统提示",
        message: content,
        type: "error",
        position: position
      });
    }
  };
};
