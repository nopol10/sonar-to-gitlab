import { Gitlab } from "@gitbeaker/node";
import { Gitlab as GitlabClass } from "@gitbeaker/core/dist/types";
import { generateFailedConditionString } from "./utils";

export class SonarToGitlab {
  api: GitlabClass;

  constructor() {
    this.api = new Gitlab({
      host: process.env.GITLAB_HOST,
      token: process.env.GITLAB_TOKEN,
    });
  }

  /**
   * Generates the sonarqube report summary comment and sends it to the merge request that triggered the build
   * @param report the SonarqubeReport sent by the Sonarcloud webhook
   */
  handleSonarqubeReport(report: SonarqubeReport) {
    let projectId = report.properties["sonar.analysis.projectId"];
    let mergeRequestId = report.properties["sonar.analysis.mergeRequestId"];
    if (!projectId || !mergeRequestId) {
      console.log("No projectId or mergeRequestId found in report");
      return;
    }

    let passed = report.qualityGate.status === "OK";
    let failedConditions = report.qualityGate.conditions.filter((condition) => {
      return condition.status === "ERROR";
    });
    let coverage = report.qualityGate.conditions.find(
      (condition) => condition.metric === "new_coverage"
    );
    let coverageString = coverage
      ? `New code coverage: ${coverage.value}% (${
          coverage.status == "OK" ? "✔" : "❌"
        })`
      : null;
    let additionalInformationHeader =
      coverageString == null ? null : "### Additional information";

    this.api.MergeRequestNotes.create(
      projectId,
      mergeRequestId,
      `
## SonarQube Code Analysis

### Quality Gate ${passed ? "passed ✅" : "failed"}

${generateFailedConditionString(failedConditions)}

[See analysis details on Sonarcloud](${report.branch.url})

${additionalInformationHeader}

${coverageString}
    `
    );
  }
}
