import { TransformOptions, Transformer } from '@jest/transform';
import requireOrImportModule from './require';

interface Config {
  /**
   * multiple transforms
   * @example
   * ```js
   * ['babel-jest', 'ts-jest']
   * [
   *   ['babel-jest', { }],
   *   ['ts-jest', { }]
   * ]
   * ```
   */
  transformers: string[] | [string, Record<string, any>][];
  /**
   * custom cache key
   * if not set, I will combine all transform's cahceKey.
   */
  getCacheKey?:
    | Transformer<Config>['getCacheKey']
    | Transformer<Config>['getCacheKeyAsync'];
}

const requireTransformer = (path: string, config: Record<string, any>) => {
  const transformer = require(path).default || require(path);

  if (!transformer.process && !transformer.processAsync) {
    if (transformer.createTransformer) {
      return transformer.createTransformer(config || {});
    }

    return null;
  }

  return transformer;
};

const importTransformer = async (path: string, config: Record<string, any>) => {
  const transformer = await requireOrImportModule<Transformer>(path);

  if (!transformer.process && !transformer.processAsync) {
    if ((transformer as any).createTransformer) {
      return (transformer as any).createTransformer(config || {});
    }

    return null;
  }

  return transformer;
};

const flatTransformers = (transformers: Config['transformers']) => {
  const containers: any[] = [];

  for (let transformer of transformers) {
    let transformerModule;

    if (typeof transformer === 'string') {
      transformerModule = requireTransformer(transformer, {});

      if (!transformerModule) {
        console.error(`cant load ${transformer} as a transformer, so skip it`);
        break;
      }
    } else if (Array.isArray(transformer)) {
      transformerModule = {
        ...requireTransformer(transformer[0], transformer[1]),
        transformerConfig: transformer[1],
      };
    }

    containers.push(transformerModule);
  }

  return containers;
};

const flatAsyncTransformers = async (transformers: Config['transformers']) => {
  const containers: any[] = [];

  for (let transformer of transformers) {
    let transformerModule;

    if (typeof transformer === 'string') {
      transformerModule = await importTransformer(transformer, {});

      if (!transformerModule) {
        console.error(`cant load ${transformer} as a transformer, so skip it`);
        break;
      }
    } else if (Array.isArray(transformer)) {
      transformerModule = {
        ...(await importTransformer(transformer[0], transformer[1])),
        transformerConfig: transformer[1],
      };
    }

    containers.push(transformerModule);
  }

  return containers;
};

const createTransformer = (): Transformer<Config> => {
  let flattenTransformers: any = null;

  const getFlattenTransformers = (options: TransformOptions<Config>) => {
    if (flattenTransformers) {
      return flattenTransformers;
    }

    return flatTransformers(options.transformerConfig.transformers);
  };

  const getFlattenAsyncTransformers = (options: TransformOptions<Config>) => {
    if (flattenTransformers) {
      return flattenTransformers;
    }

    return flatAsyncTransformers(options.transformerConfig.transformers);
  };

  const constructOptions = <T>(
    options: TransformOptions<Config>,
    config: T
  ): TransformOptions<T> => {
    return {
      ...options,
      transformerConfig: config,
    };
  };

  return {
    canInstrument: true,
    getCacheKey: (
      sourceText: string,
      sourcePath: string,
      options: TransformOptions<Config>
    ): string => {
      const transformers = getFlattenTransformers(options);

      return transformers.reduce((res: string, transformer: any) => {
        return (
          res +
            transformer.getCacheKey?.(
              sourceText,
              sourcePath,
              constructOptions(options, transformer.transformerConfig)
            ) || ''
        );
      }, '');
    },
    process: (
      sourceText: string,
      sourcePath: string,
      options: TransformOptions<Config>
    ): any => {
      const transformers = getFlattenTransformers(options);

      return transformers.reduce(
        (res: { code: string }, transformer: any) => {
          return transformer.process?.(
            res.code ? res.code : res,
            sourcePath,
            constructOptions(options, transformer.transformerConfig)
          );
        },
        { code: sourceText }
      );
    },
    getCacheKeyAsync: async (
      sourceText: string,
      sourcePath: string,
      options: TransformOptions<Config>
    ) => {
      const transformers = await getFlattenAsyncTransformers(options);

      let res = '';
      for (let transformer of transformers) {
        res +=
          (await transformer.getCacheKeyAsync?.(
            sourceText,
            sourcePath,
            constructOptions(options, transformer.transformerConfig)
          )) || '';
      }

      return res;
    },
    processAsync: async (
      sourceText: string,
      sourcePath: string,
      options: TransformOptions<Config>
    ) => {
      const transformers = await getFlattenAsyncTransformers(options);

      let res = {
        code: sourceText,
      };

      for (let transformer of transformers) {
        res = await (transformer.processAsync || transformer.process)?.(
          res.code ? res.code : res,
          sourcePath,
          constructOptions(options, transformer.transformerConfig)
        );
      }

      return res;
    },
  };
};

export default createTransformer();
