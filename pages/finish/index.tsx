import type { NextPage } from "next";
import { useRouter } from "next/router";

const FinishPage: NextPage = () => {
  const router = useRouter();
  const isEvaluator = router.query.isEvaluator === "true";
  const wasMachine = router.query.wasMachine === "true";
  console.log(isEvaluator, wasMachine);
  return <div>finish</div>;
};

export default FinishPage;
