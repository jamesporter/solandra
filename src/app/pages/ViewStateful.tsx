import React from "react";

import sketches from "../../stateful-sketches";
import { getNumber } from "../util";
import { withRouter } from "react-router-dom";
import StatefulCanvas from "../StatefulCanvas";

export const INDEX_KEY = "play-ts.index";
export const SEED_KEY = "play-ts.seed";
export const TIME_KEY = "play-ts.time";

function ViewStateful({ match }: { match: any }) {
  const parsedInt = parseInt(match.params.id);
  const idx = getNumber(INDEX_KEY);
  const sketchNo = Number.isNaN(parsedInt) ? idx || 0 : parsedInt;

  return (
    <div className="flex-1 flex flex-row items-stretch">
      <StatefulCanvas
        aspectRatio={1}
        sketch={sketches[sketchNo]}
        seed={12}
        playing={true}
      />
    </div>
  );
}

export default withRouter(ViewStateful);
