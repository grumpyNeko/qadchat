import React from "react";
import styles from "./home.module.scss";
import { IconButton } from "./button";
import { Modal } from "./ui-lib";
import AddIcon from "../icons/add.svg";
import SettingsIcon from "../icons/settings.svg";
import { useChatStore } from "../store";
import { useMaskStore } from "../store/mask";
import { useAppConfig } from "../store/config";
import { MaskAvatar } from "./mask";
import Locale, { ALL_LANG_OPTIONS } from "../locales";
import { Path } from "../constant";
import { useNavigate } from "react-router-dom";
import {
  getMaskEffectiveModel,
  getMaskDisplayModel,
} from "../utils/model-resolver";

interface MaskListProps {
  onClose: () => void;
}

export function MaskList(props: MaskListProps) {
  const chatStore = useChatStore();
  const maskStore = useMaskStore();
  const appConfig = useAppConfig();
  const navigate = useNavigate();

  const allMasks = maskStore.getAll();

  const currentMaskId = chatStore.currentMaskId;

  const handleSelectMask = (maskId: string) => {
    console.log(`wu handleSelectMask ${maskId}`);
    // 选择助手
    chatStore.selectMask(maskId);

    // 检查该助手下是否有话题
    const maskSessions = chatStore.getSessionsByMask(maskId);
    if (maskSessions.length === 0) {
      // 如果没有话题，创建一个新话题
      const selectedMask = allMasks.find((m) => m.id === maskId);
      if (selectedMask) {
        // 使用该助手创建新session
        chatStore.newSession(selectedMask);
        // 导航到聊天页面
        navigate("/chat");
      }
    } else {
      // 如果有话题，切换到最新的话题（按创建时间排序的第一个）
      const latestSession = maskSessions.sort(
        (a, b) => b.lastUpdate - a.lastUpdate,
      )[0];
      const sessionIndex = chatStore.sessions.findIndex(
        (s) => s.id === latestSession.id,
      );
      if (sessionIndex !== -1) {
        chatStore.selectSession(sessionIndex);
        // 导航到聊天页面
        navigate("/chat");
      }
    }

    props.onClose();
  };

  const handleCreateMask = () => {
    // 跳转到助手创建页面
    navigate(Path.Masks);
    props.onClose();
  };

  const handleMaskManagement = () => {
    // 跳转到助手管理页面
    navigate(Path.Masks);
    props.onClose();
  };

  return (
    <div
      className="modal-mask"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.onClose();
        }
      }}
    >
      <div className={styles["mask-list-modal-container"]}>
        <Modal
          title={Locale.Mask.Name}
          onClose={props.onClose}
          actions={[
            <IconButton
              key="manage"
              icon={<SettingsIcon />}
              text={Locale.Mask.Management}
              onClick={handleMaskManagement}
              bordered
            />,
            <IconButton
              key="add"
              icon={<AddIcon />}
              text={Locale.Mask.NewMask}
              onClick={handleCreateMask}
              bordered
            />,
          ]}
        >
          <div className={styles["mask-list-content"]}>
            {allMasks.map((mask) => (
              <div
                key={mask.id}
                className={`${styles["mask-item"]} ${
                  currentMaskId === mask.id ? styles["mask-item-selected"] : ""
                }`}
                onClick={() => handleSelectMask(mask.id)}
              >
                <div className={styles["mask-item-avatar"]}>
                  {/*<MaskAvatar*/}
                  {/*  avatar={mask.avatar}*/}
                  {/*  model={getMaskEffectiveModel(mask)}*/}
                  {/*/>*/}
                  <img
                    src={mask.botAvatar}
                    alt={""}
                    width={45}
                    height={45}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid #ddd", // 可选的边框
                    }}
                    onError={(e) => {
                      console.log(`图片加载失败`, e);
                    }}
                  />
                </div>
                <div className={styles["mask-item-info"]}>
                  <div className={styles["mask-item-name"]}>{mask.name}</div>
                  <div className={styles["mask-item-desc"]}>
                    {`${Locale.Mask.Item.Info(mask.context.length)} / ${
                      ALL_LANG_OPTIONS[mask.lang]
                    } / ${getMaskEffectiveModel(
                      mask,
                    )} / ${Locale.Mask.ConversationCount(
                      chatStore.getSessionsByMask(mask.id).length,
                    )}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
}
