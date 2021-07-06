import { IPlugin, PluginStore } from "react-pluggable";
import Notification from "./Notification";
import React from "react";

class ShowAlertPlugin implements IPlugin {
  pluginStore!: PluginStore;
  namespace = "ShowAlert";

  getPluginName(): string {
    return "ShowAlert@1.0.0";
  }

  getDependencies(): string[] {
    return [];
  }

  init(pluginStore: PluginStore): void {
    this.pluginStore = pluginStore;
  }

  activate() {
    this.pluginStore.executeFunction("Renderer.add", "paraRender", () => (
      <button>Share</button>
    ));
  }

  deactivate(): void {
    this.pluginStore.removeFunction(`${this.namespace}.doIt`);
  }
}

export default ShowAlertPlugin;