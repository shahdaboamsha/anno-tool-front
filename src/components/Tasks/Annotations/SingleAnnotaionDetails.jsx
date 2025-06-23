export default function SingleAnnotationDetails({ annotation }) {

    console.log("In single comp. ", annotation)
    const {
        sentence_text: sentenceText,
        sentence_id: sentenceId,
        user_name: userName,
        user_id: userId, label
    } = annotation

    return (
        <div>
            <table>
                <tr>User ID</tr>
                <tr>{userId}</tr>
            </table>
        </div>
    )
}