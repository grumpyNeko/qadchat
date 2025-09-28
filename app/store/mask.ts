import { getLang, Lang } from "../locales";
import { ChatMessage, DEFAULT_TOPIC } from "./chat";
import { ModelConfig, ModelType, useAppConfig } from "./config";
import { ServiceProvider, StoreKey } from "../constant";
import { nanoid } from "nanoid";
import { createPersistStore } from "../utils/store";
import { getModelCompressThreshold } from "../config/model-context-tokens";
import { DalleQuality, DalleStyle, ModelSize } from "@/app/typing";

export type Mask = {
  id: string;
  createdAt: number;
  avatar: string;
  name: string;
  hideContext?: boolean;
  context: ChatMessage[];
  syncGlobalConfig?: boolean;
  modelConfig: ModelConfig;
  defaultModel?: string; // 添加默认模型配置
  lang: Lang;
  builtin: boolean;

  enableArtifacts?: boolean;
  enableCodeFold?: boolean;

  bendUrl: string;
  botAvatar: string;
  botName: string;
  myAvatar: string;
};

export const DEFAULT_MASK_STATE = {
  masks: {} as Record<string, Mask>,
  language: undefined as Lang | undefined,
};

export type MaskState = typeof DEFAULT_MASK_STATE & {
  language?: Lang | undefined;
};

export const DEFAULT_MASK_AVATAR = "gpt-bot";
export const DEFAULT_MASK_ID = "default-mask";
export const Translate_MASK_ID = "translate-mask";
export const createTranslateMask = () => {
  return {
    id: Translate_MASK_ID,
    avatar: "1f40b",
    name: "translate",
    context: [],
    syncGlobalConfig: false, // 修改为 false，让默认助手也保持自己的配置
    modelConfig: {
      //...useAppConfig.getState().modelConfig,
      model: "grok-3-fast" as ModelType,
      providerName: "XAI" as ServiceProvider,
      temperature: 0.5,
      top_p: 1,
      max_tokens: 4000,
      presence_penalty: 0,
      frequency_penalty: 0,
      sendMemory: true,
      historyMessageCount: 4,
      compressMessageLengthThreshold: 128000,
      compressModel: "",
      compressProviderName: "",
      enableInjectSystemPrompts: true,
      template: `{{input}}`,
      size: "1024x1024" as ModelSize,
      quality: "standard" as DalleQuality,
      style: "vivid" as DalleStyle,
      thinkingBudget: 0, // 思考深度：-1=动态思考（默认），0=关闭思考，>0=指定token数量
    },
    defaultModel: undefined, // 初始化默认模型为 undefined

    lang: getLang(),
    builtin: true, // 标记为内置，不可删除
    createdAt: new Date("2025-09-01T00:00:00+08:00").getTime(),
    bendUrl: "http://localhost:8088/api/v/translate",
    botAvatar: "frieren.png",
    botName: "translator",
    myAvatar: "my.jpg",
  } as Mask;
};

export const Argue_MASK_ID = "argue-mask";
export const createArgueMask = () => {
  return {
    id: Argue_MASK_ID,
    avatar: "1f40b",
    name: "Charlie",
    context: [],
    syncGlobalConfig: false, // 修改为 false，让默认助手也保持自己的配置
    modelConfig: {
      //...useAppConfig.getState().modelConfig,
      model: "grok-3-fast" as ModelType,
      providerName: "XAI" as ServiceProvider,
      temperature: 0.5,
      top_p: 1,
      max_tokens: 4000,
      presence_penalty: 0,
      frequency_penalty: 0,
      sendMemory: true,
      historyMessageCount: 4,
      compressMessageLengthThreshold: 128000,
      compressModel: "",
      compressProviderName: "",
      enableInjectSystemPrompts: true,
      template: `{{input}}`,
      size: "1024x1024" as ModelSize,
      quality: "standard" as DalleQuality,
      style: "vivid" as DalleStyle,
      thinkingBudget: 0, // 思考深度：-1=动态思考（默认），0=关闭思考，>0=指定token数量
    },
    defaultModel: undefined, // 初始化默认模型为 undefined

    lang: getLang(),
    builtin: true, // 标记为内置，不可删除
    createdAt: new Date("2025-09-01T00:00:00+08:00").getTime(),

    bendUrl: "http://localhost:8088/api/v/argue",
    botAvatar: "Charlie.jpg",
    botName: "Charlie",
    myAvatar: "my.jpg",
  } as Mask;
};

export function isSameMask(
  masks: Record<string, Mask>,
  id: string,
  mask: Mask,
): boolean {
  const currentMask = masks[id];
  const isSame =
    currentMask && JSON.stringify(currentMask) === JSON.stringify(mask);
  if (!isSame) {
    console.log(JSON.stringify(currentMask), JSON.stringify(mask));
  }
  return isSame;
}

export const createDefaultMask = () => {
  const globalConfig = useAppConfig.getState().modelConfig;

  const defaultMask = {
    id: DEFAULT_MASK_ID,
    avatar: "1f40b",
    name: "默认助手",
    context: [],
    syncGlobalConfig: false, // 修改为 false，让默认助手也保持自己的配置
    modelConfig: {
      ...globalConfig,
      compressMessageLengthThreshold: getModelCompressThreshold(
        globalConfig.model,
      ),
    },
    defaultModel: undefined, // 初始化默认模型为 undefined

    lang: getLang(),
    builtin: true, // 标记为内置，不可删除
    createdAt: new Date("2025-09-01T00:00:00+08:00").getTime(),

    bendUrl: "",
    botAvatar: "",
    botName: "",
    myAvatar: "",
  } as Mask;

  return defaultMask;
};

export const createEmptyMask = () => {
  const globalConfig = useAppConfig.getState().modelConfig;
  return {
    id: nanoid(),
    avatar: DEFAULT_MASK_AVATAR,
    name: DEFAULT_TOPIC,
    context: [],
    syncGlobalConfig: true, // use global config as default
    modelConfig: {
      ...globalConfig,
      compressMessageLengthThreshold: getModelCompressThreshold(
        globalConfig.model,
      ),
    },
    defaultModel: undefined, // 初始化默认模型为 undefined

    lang: getLang(),
    builtin: false,
    createdAt: Date.now(),
    plugin: [],

    bendUrl: "",
    botAvatar: "",
    botName: "",
    myAvatar: "",
  } as Mask;
};

// 有循环渲染问题的代码
// if (!isSameMask(masks, Translate_MASK_ID, createTranslateMask())) {
//   console.log(`Translate_MASK_ID not same`)
//   masks[Translate_MASK_ID] = createTranslateMask()
// }
// export function isSameMask(
//   masks: Record<string, Mask>, id: string, mask: Mask
// ): boolean {
//   const currentMask = masks[id];
//   const isSame =
//   currentMask &&
//     JSON.stringify(currentMask) === JSON.stringify(mask);
//   if (!isSame) {
//     console.log(JSON.stringify(currentMask), JSON.stringify(mask))
//   }
//   return isSame
// }
export const useMaskStore = createPersistStore(
  { ...DEFAULT_MASK_STATE },

  (set, get) => ({
    create(mask?: Partial<Mask>) {
      const masks = get().masks;
      const id = nanoid();
      masks[id] = {
        ...createEmptyMask(),
        ...mask,
        id,
        builtin: false,
      };

      set(() => ({ masks }));
      get().markUpdate();

      return masks[id];
    },
    updateMask(id: string, updater: (mask: Mask) => void) {
      const masks = get().masks;
      const mask = masks[id];
      if (!mask) return;
      const updateMask = { ...mask };
      updater(updateMask);
      masks[id] = updateMask;
      set(() => ({ masks }));
      get().markUpdate();
    },
    delete(id: string) {
      // 防止删除默认助手
      if (id === DEFAULT_MASK_ID) {
        return;
      }
      const masks = get().masks;
      delete masks[id];
      set(() => ({ masks }));
      get().markUpdate();
    },

    get(id?: string) {
      return get().masks[id ?? 1145141919810];
    },
    getAll() {
      // 避免在渲染期间触发set()，不修改store状态
      // 仅在返回结果中确保必需的内置助手存在
      const ensuredMasks: Record<string, Mask> = {
        DEFAULT_MASK_ID: createDefaultMask(),
        Translate_MASK_ID: createTranslateMask(),
        Argue_MASK_ID: createArgueMask(),
      };
      const ret = Object.values(ensuredMasks).sort(
        (a, b) => b.createdAt - a.createdAt,
      );
      return ret;
      // const masks = get().masks;
      // const ensuredMasks: Record<string, Mask> = {
      //   ...masks,
      //   [DEFAULT_MASK_ID]: masks[DEFAULT_MASK_ID]
      //     ? masks[DEFAULT_MASK_ID]
      //     : createDefaultMask(),
      //   [Translate_MASK_ID]: masks[Translate_MASK_ID]
      //     ? masks[Translate_MASK_ID]
      //     : createTranslateMask(),
      //   [Argue_MASK_ID]: masks[Argue_MASK_ID]
      //     ? masks[Argue_MASK_ID]
      //     : createArgueMask(),
      // };
    },
    search(text: string) {
      return Object.values(get().masks);
    },
    setLanguage(language: Lang | undefined) {
      set({
        language,
      });
    },
  }),
  {
    name: StoreKey.Mask,
    version: 3.2,

    migrate(state, version) {
      const newState = JSON.parse(JSON.stringify(state)) as MaskState;

      // migrate mask id to nanoid
      if (version < 3) {
        Object.values(newState.masks).forEach((m) => (m.id = nanoid()));
      }

      if (version < 3.1) {
        const updatedMasks: Record<string, Mask> = {};
        Object.values(newState.masks).forEach((m) => {
          updatedMasks[m.id] = m;
        });
        newState.masks = updatedMasks;
      }

      // 修复默认助手的同步配置
      if (version < 3.2) {
        Object.values(newState.masks).forEach((m) => {
          // 修复默认助手的同步配置
          if (m.id === DEFAULT_MASK_ID && m.syncGlobalConfig === true) {
            m.syncGlobalConfig = false;
          }
        });
      }

      // 确保默认助手存在
      if (!newState.masks[DEFAULT_MASK_ID]) {
        newState.masks[DEFAULT_MASK_ID] = createDefaultMask();
      }

      return newState as any;
    },
  },
);
