import { Contest } from "../../types/contest";
import { getApiContestData } from '../../api/getData';

async function getContest(contestId: number): Promise<Contest | undefined> {
  const allContests = await getApiContestData();
  let contests: Contest[] = allContests;
  const contest = contests.find((c) => c.contestid == contestId);
  return contest;
}

function isContestActive(contest: Contest): boolean {
  if (!contest) {
    return false;
  }

  const now = Date.now();
  const start = new Date(contest.start_time).getTime();
  const end = new Date(contest.end_time).getTime();

  return now >= start && now <= end;
}

// @todo: determine if this is the right place for these functions
const riskCodeToLabelMap = {
  "3": "3 (High Risk)",
  "2": "2 (Med Risk)",
  Q: "QA (Quality Assurance)",
  G: "G (Gas Optimization)",
};

function getRiskCodeFromGithubLabel(label: string): string {
  for (const code in riskCodeToLabelMap) {
    if (riskCodeToLabelMap[code] === label) {
      return code;
    }
  }
  throw { message: "risk not found" };
}

function getGithubLabelFromRiskCode(code: string): string {
  const label = riskCodeToLabelMap[code];
  if (label) {
    return label;
  }
  throw "risk label not found";
}

export {
  getContest,
  isContestActive,
  getRiskCodeFromGithubLabel,
  getGithubLabelFromRiskCode,
};
