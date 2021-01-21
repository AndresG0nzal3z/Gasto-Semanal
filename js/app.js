// declarations
const Form = document.querySelector('#agregar-gasto');
const ExpenseList = document.querySelector('#gastos ul');

// classes
class Quote {
    constructor(budget){
        this.budget = Number(budget);
        this.remaining = Number(budget);
        this.expenses = [];
    }
    newExpense(expense){
        this.expenses = [...this.expenses, expense];
        this.calculateRemaining();
    }
    calculateRemaining(){
        const expensed = this.expenses.reduce((total, expense) => total + expense.quantity, 0);
        this.remaining = this.budget - expensed;
    }
    deleteExpense(id){
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.calculateRemaining();
    }
}
class UserInterface {
    insertBudget(quantity){
        const { budget, remaining } = quantity;

        // insert in html
        document.querySelector('#total').textContent = budget;
        document.querySelector('#restante').textContent = remaining;
    }
    showAlert(message, type){
        
        // insert in html
        const divMessage = document.createElement('div');
        divMessage.classList.add('text-center', 'alert');

        if(type === 'error'){
            divMessage.classList.add('alert-danger');
        }else{
            divMessage.classList.add('alert-success');
        }

        divMessage.textContent = message;
        document.querySelector('.primario').insertBefore(divMessage, Form);

        // remove after 3s
        setTimeout(() => {
            divMessage.remove();
        }, 2000);
    }
    setToList(expenses){
        clearHTML(ExpenseList);
        expenses.forEach( expense => {
            const { name, quantity, id } = expense;

            // set in html
            const element = document.createElement('li');
            element.className = 'list-group-item d-flex justify-content-between align-items-center';
            element.dataset.id = id;

            element.innerHTML = `${name} <span class="badge badge-primary badge-pill">$${quantity}</span>`;

            const btnDelete = document.createElement('button');
            btnDelete.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnDelete.innerHTML = `Delete &times`;
            btnDelete.onclick = () => {
                deleteExpense(id)
            };

            element.appendChild(btnDelete);

            ExpenseList.appendChild(element);
        })
    }
    updateRemaining(remaining) {
        document.querySelector('#restante').textContent = remaining;
    }
    checkBudget(budgetObject) {
        const div = document.querySelector('.restante');
        const { budget, remaining } = budgetObject;
        
        if((budget / 4) >= remaining){ // 25%
            div.classList.remove('alert-success', 'alert-warning');
            div.classList.add('alert-danger');
        }else if((budget / 2) >= remaining){ // 50%
            div.classList.remove('alert-success', 'alert-danger');
            div.classList.add('alert-warning');
        }else{
            div.classList.remove('alert-danger', 'alert-warning');
            div.classList.add('alert-success');
        }

        if(remaining <= 0){
            UI.showAlert('The budget is over!', 'error');

            Form.querySelector('button[type="submit"]').disabled = true;
        }
    }
}
let currentBudget;
const UI = new UserInterface();

// events
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', askBudget('What is your budget?'));
    Form.addEventListener('submit', addExpense);
}

// functions
function askBudget(message) {
    const userBudget = prompt(`${message}`);
    if(userBudget === '' || userBudget === null || isNaN(userBudget) || userBudget <= 0) {
        askBudget('Write a correct number...');
    }
    currentBudget = new Quote(userBudget);
    UI.insertBudget(currentBudget);
}
function addExpense(e){
    e.preventDefault();

    // read form data
    const name = document.querySelector('#gasto').value;
    const quantity = Number(document.querySelector('#cantidad').value);

    if(name === '' || quantity === ''){
        UI.showAlert('Both fields are required ...', 'error');
        return;
    }else if(quantity <= 0 || isNaN(quantity)){
        UI.showAlert('You must enter a valid amount (greater than 0) ...', 'error');
        return;
    }

    const expense = { name, quantity, id: Date.now() };

    currentBudget.newExpense(expense);

    UI.setToList(currentBudget.expenses);
    UI.updateRemaining(currentBudget.remaining);
    UI.checkBudget(currentBudget);
    UI.showAlert('Success!');

    Form.reset();
}
function clearHTML(element){
    while (element.firstChild) {
        element.firstChild.remove();
    }
}
function deleteExpense(id){
    // elimina el objeto del arreglo
    currentBudget.deleteExpense(id);

    // elimina el objeto del html
    UI.setToList(currentBudget.expenses);
    UI.updateRemaining(currentBudget.remaining);
    UI.checkBudget(currentBudget);
}