import { contextBridge, ipcRenderer } from 'electron';

type OpenPrompterResult = {
  ok: boolean;
  reason?: string;
};

contextBridge.exposeInMainWorld('saarwoodDesktop', {
  isDesktopApp: true,
  openPrompterOnSecondMonitor: async (): Promise<OpenPrompterResult> => {
    const result = await ipcRenderer.invoke('desktop:open-prompter-monitor-2');
    return result as OpenPrompterResult;
  },
});
