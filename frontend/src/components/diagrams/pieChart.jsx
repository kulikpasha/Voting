import React from 'react'
import {Pie} from 'react-chartjs-2'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

// Регистрация элементов
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({data}) {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Dataset',
                data: data.values,
                backgroundColor: [
                    '#4287f5', '#42f584', '#bd4046', '#d4ba37', '#ad50bf', '#dba35a'
                ],
                hoverBackgroundColor: [
                    '#2a77db', '#2fed75', '#db2c34', '#dec028', '#b53bcc', '#eba03f'
                ]
            }
        ]
    }

    const options = {
        plugins: {
            legend: {
                labels: {
                    color: 'white',
                    font: {
                        size: 17
                    }
                }
            }
        }
    }

    return (
        <div>
            <Pie data={chartData} options={options}/>
        </div>
    )
}

export default PieChart