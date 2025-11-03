import React, { use } from 'react';
import { fold, unfold } from './fold';
import { button, folder, useControls } from 'leva';
import { Schema} from 'leva/dist/declarations/src/types';
import { downloadBlob } from './download';

const SEP = '_';

const toKey = (k: string, prevKey: string | undefined) => {
  if (!prevKey) return k;
  return `${prevKey}${SEP}${k}`;
};

function gatherKeys(schema: Schema, prevKey?: string): string[] {
  return Object.entries(schema).reduce(
    (acc, [k, v]: [string, any]) => {
      const key = prevKey ? `${prevKey}.${k}` : k;
      return v && typeof v === 'object' && v.schema ? [...acc, ...gatherKeys(v.schema, key)] : [...acc, key];
    },
    [] as string[],
  );
};

function createSchema<T extends object>(defaultValues: T, actualValue?: T): Schema {
  const keysFlat = Object.keys(defaultValues);
  const groups = keysFlat.map(key => [key, keysFlat.find(x => x !== key && key.startsWith(x))]).filter(([, x]) => !!x);

  function recurse(source: T, values?: T, prevKey?: string): Schema {
    return Object.entries(source).reduce(
      (acc, [sourceKey, defaultValue]) => {
        const flatKey = toKey(sourceKey, prevKey);
        const actual = values ? (values as any)[sourceKey] : undefined;

        if (defaultValue && typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
          if (!acc[flatKey]) {
            acc[flatKey] = folder({}, { collapsed: true });
          }
          (acc[flatKey] as any).schema = { ...(acc[flatKey] as any).schema, ...recurse(defaultValue, actual, flatKey) };
          return acc;
        }

        const value = actual === undefined ? defaultValue : actual;
        const scalarSchema: Schema[''] = {
          value,
          label: sourceKey,
        };

        const group = groups.find(x => x[0] === flatKey);
        const groupKey = group ? group[1] : undefined;
        if (groupKey) {
          if (!acc[groupKey]) {
            acc[groupKey] = folder({}, { collapsed: true });
          }
          (acc[groupKey] as any).schema[flatKey] = scalarSchema;
          return acc;
        }

        acc[flatKey] = scalarSchema;
        return acc;
      },
      {} as Schema,
    );
  }

  return recurse(defaultValues, actualValue);
};

function createValues<T extends object>(defaultValues: T, actualValue?: T) {
  const values = fold(actualValue, SEP);
  return Object.entries(fold(defaultValues, SEP)).reduce(
    (acc, [key, defaultValue]) => ({
      ...acc,
      [key]: values[key] === undefined ? defaultValue : values[key],
    }),
    {} as Schema,
  );
};

const exportSchemaValues = (group: string, schema: Schema) => (get: (x: string) => any) => {
  const value = gatherKeys(schema, group).reduce(
    (acc, k) => {
      const sourceKey = k.split('.').slice(-1)[0];
      return ({ ...acc, [sourceKey]: get(k) });
    },
    {} as any,
  );

  const json = JSON.stringify(unfold(value, SEP), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, `${group.toLowerCase()}.json`);
};

export function useObjectControl<T extends object>(group: string, defaultValue: T, actualValue?: T): T {
  const getSchema = (): Schema => {
    const schema = createSchema(defaultValue, actualValue);
    return {
      'Export': button(exportSchemaValues(group, schema)),
      ...schema,
    };
  };

  const [result, setResult] = useControls(group, getSchema, { collapsed: true }, [defaultValue]);
  React.useEffect(
    () => {
      setResult(createValues(defaultValue, actualValue));
    },
    [defaultValue, actualValue],
  );
  return React.useMemo(() => unfold(result, SEP), [result]);
};

export function persistValue<T>(key: string, defaultValue: T) {
  const lsValue = window.localStorage.getItem(key);
  const value = lsValue ? JSON.parse(lsValue) as T : defaultValue;
  const useSave = (v: T) => {
    React.useEffect(
      () => {
        window.localStorage.setItem(key, JSON.stringify(v));
      },
      [v],
    );
  };

  return [value, useSave] as [T, typeof useSave];
};
