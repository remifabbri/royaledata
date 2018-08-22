#!/bin/bash

echo -e "${CCYAN}-> Démarage du service MongoDB ${CEND}"
    #service mongod start
    if [ $? == 0 ]; then
        echo -e "${CGREEN}-> Ok : service mongod start ${CEND}"
    else
        echo -e "${CRED}-> ERREUR : Service abort ${CEND}"
    fi

echo -e "${CCYAN}-> Find Working Folder ${CEND}"
    
    jhome () {
        cd /home/krash/Weblab/royaledata
        npm run start
    }
    if [ $? == 0 ]; then
        echo -e "${CGREEN}-> Ok : V ${CEND}"
    else
        echo -e "${CRED}-> ERREUR : N ${CEND}"
    fi

echo -e "${CCYAN}-> Démarage du serveur ${CEND}"
    #npm run start
    if [ $? == 0 ]; then
        echo -e "${CGREEN}-> Ok : V ${CEND}"
    else
        echo -e "${CRED}-> ERREUR : N ${CEND}"
    fi