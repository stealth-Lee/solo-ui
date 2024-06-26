import { VNode, h } from "vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { GlobalStatus } from "@/utils/constants";
import { i18n } from "@/plugins/i18n";

const { t } = i18n.global;

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
    success(content?: string, showClose?: boolean) {
      ElMessage({
        showClose: showClose,
        message: content ? content : t("prompt.action.success"),
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
    error(content?: string, showClose?: boolean) {
      ElMessage({
        showClose: showClose,
        message: content ? content : t("prompt.action.fail"),
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
      ElMessageBox.alert(content, t("prompt.system"));
    },
    // 成功提示
    success(content: string) {
      ElMessageBox.alert(content, t("prompt.system"), {
        type: "success"
      });
    },
    // 警告提示
    warning(content: string) {
      ElMessageBox.alert(content, t("prompt.system"), {
        type: "warning"
      });
    },
    // 错误提示
    error(content: string) {
      ElMessageBox.alert(content, t("prompt.system"), {
        type: "error"
      });
    },
    // 确认窗体
    confirm(content: Content, title?: string) {
      return ElMessageBox.confirm(content, title ? title : t("prompt.system"), {
        confirmButtonText: t("buttons.common.confirm"),
        cancelButtonText: t("buttons.common.cancel"),
        type: "warning"
      });
    },
    // 状态窗体
    switch(status: number, name?: any, title?: string) {
      const text =
        status === GlobalStatus.ENABLE
          ? h(
              "span",
              { style: "color: teal; font-weight: bold" },
              t("buttons.common.enable")
            )
          : h(
              "span",
              { style: "color: red; font-weight: bold" },
              t("buttons.common.disable")
            );
      name = name
        ? h("span", { style: "font-weight: bold" }, ` “${name}” `)
        : null;
      const c = h("p", null, [
        h("span", null, `${t("commons.ask.confirm")} `),
        text,
        name,
        h("span", null, `${title}？`)
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
        title: t("prompt.system"),
        message: content,
        type: "info",
        position: position
      });
    },
    // 成功提示
    success(content: string, position?: Position) {
      ElNotification({
        title: t("prompt.system"),
        message: content,
        type: "success",
        position: position
      });
    },
    // 警告提示
    warning(content: string, position?: Position) {
      ElNotification({
        title: t("prompt.system"),
        message: content,
        type: "warning",
        position: position
      });
    },
    // 错误提示
    error(content: string, position?: Position) {
      ElNotification({
        title: t("prompt.system"),
        message: content,
        type: "error",
        position: position
      });
    }
  };
};
