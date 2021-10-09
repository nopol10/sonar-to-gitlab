import { GRADE_MAP, METRIC_NAME_MAP } from "./constants";

function getMetricOperatorString(metric: string) {
  switch (metric) {
    case "new_reliability_rating":
    case "new_security_rating":
    case "new_security_review_rating":
    case "new_maintainability_rating":
      return "is worse than";
    case "new_coverage":
    case "new_security_hotspots_reviewed":
    case "new_branch_coverage":
    case "new_line_coverage":
      return "is less than";
    case "new_duplicated_lines_density":
    case "new_blocker_violations":
    case "new_bugs":
    case "new_code_smells":
    case "new_conditions_to_cover":
    case "new_critical_violations":
    case "new_duplicated_blocks":
    case "new_duplicated_lines":
    case "new_info_violations":
    case "new_lines":
    case "new_lines_to_cover":
    case "new_major_violations":
    case "new_minor_violations":
    case "new_reliability_remediation_effort":
    case "new_security_remediation_effort":
    case "new_sqale_debt_ratio": // technical debt ratio
    case "new_technical_debt":
    case "new_uncovered_conditions":
    case "new_uncovered_lines":
    case "new_violations":
    case "new_vulnerabilities":
      return "is greater than";
    default:
      return "does not meet";
  }
}

export function getMetricWithUnit(metric: string, value: string) {
  switch (metric) {
    case "new_reliability_rating":
    case "new_security_rating":
    case "new_security_review_rating":
    case "new_maintainability_rating":
      return `${GRADE_MAP[value]}`;
    case "new_branch_coverage":
    case "new_coverage":
    case "new_duplicated_lines":
    case "new_line_coverage":
    case "new_security_hotspots_reviewed":
    case "new_sqale_debt_ratio":
      return `${value}%`;
    case "new_technical_debt":
    case "new_reliability_remediation_effort":
    case "new_security_remediation_effort":
      return `${value}min`;
    case "new_duplicated_lines_density":
    case "new_blocker_violations":
    case "new_bugs":
    case "new_code_smells":
    case "new_conditions_to_cover":
    case "new_critical_violations":
    case "new_duplicated_blocks":
    case "new_info_violations":
    case "new_lines":
    case "new_lines_to_cover":
    case "new_major_violations":
    case "new_minor_violations":
    case "new_uncovered_conditions":
    case "new_uncovered_lines":
    case "new_violations":
    case "new_vulnerabilities":
    default:
      return value;
  }
}

export function generateFailedConditionString(
  failedConditions: QualityGateCondition[]
): string {
  return failedConditions
    .map((condition) => {
      const metricName = METRIC_NAME_MAP[condition.metric] || condition.metric;
      const operatorString = getMetricOperatorString(condition.metric);
      return `❌ ${getMetricWithUnit(
        condition.metric,
        condition.value
      )} ${metricName} (${operatorString} ${getMetricWithUnit(
        condition.metric,
        condition.errorThreshold
      )})`;
    })
    .join(`<br>`);
}
