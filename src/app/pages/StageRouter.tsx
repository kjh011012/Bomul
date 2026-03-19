import { useParams, useNavigate } from 'react-router';
import { Stage1Puzzle } from './stages/Stage1Puzzle';
import { Stage2Puzzle } from './stages/Stage2Puzzle';
import { Stage3Puzzle } from './stages/Stage3Puzzle';
import { Stage4Puzzle } from './stages/Stage4Puzzle';
import { Stage5Puzzle } from './stages/Stage5Puzzle';
import { GenericStagePuzzle } from './stages/GenericStagePuzzle';

export function StageRouter() {
  const { stageId } = useParams<{ stageId: string }>();
  const num = Number(stageId);

  switch (num) {
    case 1: return <Stage1Puzzle />;
    case 2: return <Stage2Puzzle />;
    case 3: return <Stage3Puzzle />;
    case 4: return <Stage4Puzzle />;
    case 5: return <Stage5Puzzle />;
    default: return <GenericStagePuzzle />;
  }
}
