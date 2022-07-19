import { Handler } from "@netlify/functions";

import { checkAuth } from "../util/auth-utils";
import { getContest, isContestActive } from "../util/contest-utils";
import { wardenFindingsForContest } from "../util/github-utils";


async function getFindings(req) {
  // todo: ensure contestId / wardenHandle exist?

  const contestId = parseInt(req.queryStringParameters?.contest);
  // const wardenHandle = req.queryStringParameters?.handle;
  const wardenHandle = req.headers["c4-user"];

  const contest = await getContest(contestId);

  // first phase:
  // given active! contest id
  if (!isContestActive(contest)) {
    // throw?
  }

  // warden can see own findings
  const wardenFindings = await wardenFindingsForContest(wardenHandle, contest);

  // warden can see team findings
  // if (req.queryStringParameters?.teamFindings) {
  //   await wardenFindingsForContest(teamHandle, contest.repo);
  // }

  const res = {
    [wardenHandle]: wardenFindings,
  }

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
}

async function editFinding(req) {
  // an authenticated warden can edit a finding
  //   for active contests
  //     their own (their teams')
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}

const handler: Handler = async (event, context) => {
  if (!(await checkAuth(event))) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Unauthorized",
      }),
    };
  }

  switch (event.httpMethod) {
    case "GET":
      return await getFindings(event);
    case "POST":
      return await editFinding(event);
    default:
      return {
        statusCode: 418,
        body: JSON.stringify({
          error: "nuh-uh",
        })
      }
  }
};

export { handler };
