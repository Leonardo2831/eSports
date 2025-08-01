import {Select} from './utility-functions.js';

const selectItem = new Select();

const inputQuestion = selectItem.Single('#input-question');
const selectGame = selectItem.Single('#selectGame');

const form = selectItem.Single('#form');
const submitButton = selectItem.Single('#submit-button');

const apiResponseContent = selectItem.Single('#aiResponse');

async function fetchGemini(){
    apiResponseContent.classList.add('hidden');

    if(inputQuestion.value == '' || selectGame.value == ''){
        alert('Preencha todos os campos!');  
        return;
    } 

    submitButton.disabled = true;
    submitButton.textContent = 'Perguntando...'
    submitButton.classList.add('animate-loading');
    
    try {
        const response = await fetch("https://esports-games.vercel.app/api/requestGemini", {
            method: 'POST',
            headers: {
                    "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: inputQuestion.value,
                contextGame: selectGame.value,
            }),
        });

        const dataGimini = await response.json();
        const messageIA = dataGimini.message;

        const convert = new showdown.Converter();
        const convertHtml = convert.makeHtml(messageIA);

        apiResponseContent.querySelector('.response-content').innerHTML = convertHtml;
        
    } catch {
        // houve um erro, tente novamente mais tarde.
        apiResponseContent.querySelector('.response-content').innerHTML = 
            '<p>Houve um <b class="text-[18px]">erro</b>, tente novamente mais tarde!</p>';
        
    } finally {
        apiResponseContent.classList.remove('hidden');

        submitButton.disabled = false;
        submitButton.textContent = 'Perguntar'
        submitButton.classList.remove('animate-loading');
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    fetchGemini();
});

form.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        event.preventDefault();
        fetchGemini();
    }
});