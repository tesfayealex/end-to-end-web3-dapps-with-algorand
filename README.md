# end-to-end-web3-dapps-with-algorand

## Introduction

<p>
This project involves building a distributed app for 10 academy that enables their trainees to accept their weekly challenge certificate in Non-Fungible Tokens (NFT’s) using the Algorithm blockchain, and allowing trainees with NFTs to interact with a smart contract to perform predefined actions
</p>

## Included Technologies and tools

<p>
Algorand - is an open-source, decentralized blockchain network that leverages a two-tiered structure and a unique variation of the Proof-of-Stake (PoS) consensus mechanism to increase transaction speeds and achieve finality
</p>

<p>
React - For the front end of the app, we are going to use a well-known javascript framework called React. It has massive support and important addons.
</p>

<p>
Django - For the backend of the app, we will use Django, which is a high-level Python web framework that encourages rapid development and clean, pragmatic design.
</p>

## Dev Setup

    1, setup and activate python environment
        ```bash
            python3 -m venv venv
            venv/bin/activate
        ```
    2, Install requirements from requirement file
        ```bash
            pip install -r requirements.txt
        ```
    3, Download algorand sandbox and run the sandbox
    4, Start Django server using
        ```bash
            cd backend
            python manage.py migrate
            python manage.py runserver
        ```
    4, setup node environment for reactjs by using
        ```bash
            npm install
        ```
    5, then go inside frontend folder and start react server by using 
        ```bash
            cd front_end
            npm start
        ```   
### root folder:

- `requirements.txt`: a text file lsiting the projet's dependancies.
- `README.md`: Markdown text with a brief explanation of the project and the repository structure.
- `Dockerfile`: build users can create an automated build that executes several command-line instructions in a container.