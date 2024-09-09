import React, {useEffect, useState} from 'react'
import Answer from './answer'

export default function AP_Question( {id, poll_id, question_text, img } ) {
    const [question, setQuestion] = useState()

    return (
        <>
            <div className='question'>
                <div className='question_text'>
                    {question_text}
                </div>
                <div className='answers'>
                    <Answer/>
                </div>
            </div>
        </>
    )
}