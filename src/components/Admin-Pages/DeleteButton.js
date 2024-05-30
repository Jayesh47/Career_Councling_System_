import axios from "axios";
import React from "react";

export default function DeleteButton({ id, type }) {
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this ' + type + '?')) {
            axios.get(`http://localhost:5500/delete-item`, { params: [id, type] })
                .then(response => {
                    console.log("Success: your " + type + " is deleted.");
                })
                .catch(error => {
                    console.error('Error deleting ' + type + ':', error);
                });
        }
    }
    return (
        <button type="button" onClick={handleDelete} className="btn btn-danger">Delete</button>
    )
}