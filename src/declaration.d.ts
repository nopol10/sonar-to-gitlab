type QualityGateCondition = {
  metric: string;
  operator: string;
  value: string;
  status: string;
  errorThreshold: string;
};

type SonarqubeReport = {
  serverUrl: string;
  taskId: string;
  status: string;
  analysedAt: string;
  revision: string;
  changedAt: string;
  project: {
    key: string;
    name: string;
    url: string;
  };
  branch: {
    name: string;
    type: string;
    isMain: boolean;
    url: string;
  };
  qualityGate: {
    name: string;
    status: string;
    conditions: QualityGateCondition[];
  };
  properties: { [id: string]: string };
};
