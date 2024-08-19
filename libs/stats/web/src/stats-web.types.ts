import {
  HealthzHttpType,
  HealthzMemoryType,
  HealthzPostgresType,
  HealthzRedisType,
  HealthzStatusType,
} from '@dx/healthz-shared';

export type StatsApiHealthType = {
  http?: HealthzHttpType;
  memory?: HealthzMemoryType;
  postgres?: HealthzPostgresType;
  redis?: HealthzRedisType;
}

export type StatsStateType = {
  api?: StatsApiHealthType;
};
