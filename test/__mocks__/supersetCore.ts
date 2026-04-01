type ChartPropsConfig = Record<string, any>;

export class ChartProps {
  width: number;

  height: number;

  formData: Record<string, any>;

  queriesData: Record<string, any>[];

  theme: Record<string, any>;

  constructor(config: ChartPropsConfig) {
    Object.assign(this, config);
  }
}

export class ChartMetadata {
  config: Record<string, any>;

  constructor(config: Record<string, any>) {
    this.config = config;
  }
}

export class ChartPlugin {
  config: Record<string, any>;

  constructor(config: Record<string, any>) {
    this.config = config;
  }
}

export const supersetTheme = {};

export const CategoricalColorNamespace = {
  getScale: () => (key: string) => key,
};

export function buildQueryContext(
  formData: Record<string, any>,
  buildFinalQueryObjects?: (baseQueryObject: Record<string, any>) => Record<string, any>[],
) {
  const baseQueryObject = {
    annotation_layers: formData.annotation_layers,
    filters: [],
    granularity: formData.granularity_sqla ?? formData.granularity,
    metrics: formData.metrics,
    time_range: formData.time_range,
  };

  return {
    datasource: { id: 0, type: 'table' },
    force: false,
    form_data: formData,
    queries: buildFinalQueryObjects ? buildFinalQueryObjects(baseQueryObject) : [baseQueryObject],
    result_format: 'json',
    result_type: 'full',
  };
}

export function ensureIsArray<T>(value: T | T[] | null | undefined): T[] {
  if (value == null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export function getMetricLabel(metric: any): string {
  if (typeof metric === 'string') {
    return metric;
  }

  return metric?.label ?? metric?.metric_name ?? metric?.sqlExpression ?? '';
}

export function getNumberFormatter() {
  return (value: number) => String(value);
}

export function getTimeFormatter(format?: string) {
  return (value: number | string | Date) => {
    const normalizedValue =
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value)
        ? `${value}Z`
        : value;
    const date = normalizedValue instanceof Date ? normalizedValue : new Date(normalizedValue);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    if (format === '%m-%d-%Y %I:%M:%S %p') {
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const year = date.getUTCFullYear();
      const rawHours = date.getUTCHours();
      const hours = String(rawHours % 12 || 12).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      const meridiem = rawHours >= 12 ? 'PM' : 'AM';
      return `${month}-${day}-${year} ${hours}:${minutes}:${seconds} ${meridiem}`;
    }

    return date.toISOString();
  };
}

export function t(value: string) {
  return value;
}

export function validateNonEmpty(value: unknown) {
  if (Array.isArray(value) && value.length) {
    return false;
  }

  if (value !== null && typeof value !== 'undefined' && value !== '') {
    return false;
  }

  return 'Required';
}
