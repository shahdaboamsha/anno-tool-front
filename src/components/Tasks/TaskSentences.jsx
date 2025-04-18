import { useEffect, useState } from "react";
import InnerLoader from "../InnerLoader";
import axios from "axios";
import { Alert } from "@mui/material";
import SentencesAsTable from "./SentencesAsTable";

export default function TaskSentences({ api }) {

    const [sentences, setSentences] = useState([])
    const [loading, setLoading] = useState(true)
    const [alertMsg, setAlertMsg] = useState({
        severity: 'error',
        message: null
    })

    useEffect(() => {
        const getSentences = async () => {

            try {
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
                }

                const sentences = (await axios.get(api, { headers: headers })).data
                setSentences(sentences)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
        getSentences()
    }, [api])


    return (
        <>
            {loading ? <InnerLoader /> :
                <div>
                    {alertMsg.message ? <Alert severity={alertMsg.severity}>{alertMsg.message}</Alert> : ""}
                    <table>
                        <tbody>
                            <tr>
                                <th className="text-left p-2 font-semibold">Total number of sentences</th>
                                <td className="p-2">{sentences.length}</td>
                            </tr>
                        </tbody>

                    </table>

                    <SentencesAsTable sentences={sentences} />
                </div>
            } </>

    )
}