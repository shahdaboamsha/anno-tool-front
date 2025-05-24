import { Alert } from "@mui/material";
import SentencesAsTable from "./SentencesAsTable";

export default function TaskSentences({ taskSentences = [] }) {

    return (
        <div>
            {taskSentences.length === 0 && <Alert severity='error'>Error while fetching sentences</Alert>}
            <table>
                <tbody>
                    <tr>
                        <th className="text-left p-2 font-semibold">Total number of sentences</th>
                        <td className="p-2">{taskSentences.length}</td>
                    </tr>
                </tbody>

            </table>
            <SentencesAsTable sentences={taskSentences} />
        </div>
    )
}