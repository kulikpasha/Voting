import React, {useEffect, useState} from 'react'

export default function Answer({id, question_id, answer, poll_id}) {
    const [newAnswers, setNewAnswers] = useState(answer)
    useEffect(() => {

    })

    return (
        <>
            <div className={`answer AFP${poll_id}_FQ${question_id}`}>
                <div className={`Aball` /*AFP${poll_id}_FQ${question_id}`*/}/><span>{answer}</span>
            </div>
        </>
    )
}