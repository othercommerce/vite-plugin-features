import type { Plugin, ResolvedConfig } from 'vite';
import { loadFeaturesModule } from './loader';

export type Options = {
  local: string;
  vendor: string;
}

const defaults: Options = {
  local: 'resources/js/types/generated',
  vendor: 'vendor/procommerce/framework/packages/types/generated',
};

export default function features(props?: Partial<Options>): Plugin {
  let options: Options = { ...defaults, ...props };
  let config: ResolvedConfig;

  return {
    name: 'vite-plugin-features',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    resolveId(id) {
      if (id === '$features') return '\0$features';
    },

    load(id) {
      if (id === '\0$features') return loadFeaturesModule(config, options);
    },

    configureServer(server) {
      server.watcher.on('change', (path: string) => {
        if (path.endsWith('Features.php')) {
          loadFeaturesModule(config, options, false);

          const featuresModule = server.moduleGraph.getModuleById('\0$features');

          if (featuresModule) {
            server.reloadModule(featuresModule);
          }
        }
      });
    },
  };
}






