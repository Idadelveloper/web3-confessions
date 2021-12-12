import React from 'react'
import './TextBox.css'

export default function TextBox({visibility, handleSubmit}) {

    return (
        <div className={visibility ? "show-box" : "hide-box"}>
            <form onSubmit={() => handleSubmit()}>
                <label>
                Confess:
                <textarea  />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}
