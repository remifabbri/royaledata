#!/bin/bash

###################################################
#						  #
#			Color  			  #
#						  #
###################################################

CSI="\033["
CEND="${CSI}0m"
CGREEN="${CSI}1;32m"
CYELLOW="${CSI}1;33m"
CRED="${CSI}1;31m"
CCYAN="${CSI}1;36m"


###################################################
#						  #
#			functions	  		  #
#						  #
###################################################

startMongod() {
    echo -e "${CCYAN}-> Démarage du service MongoDB ${CEND}"
    #service mongod start
    if [ $? == 0 ]; then
        echo -e "${CGREEN}-> Ok : service mongod start ${CEND}"
    else
        echo -e "${CRED}-> ERREUR : Service abort ${CEND}"
    fi
}


workHome () {
    echo -e "${CCYAN}-> Find Working Folder ${CEND}"
        cd /home/krash/Weblab/royaledata
        npm run start
        
        if [ $? == 0 ]; then
            echo -e "${CGREEN}-> Ok : V ${CEND}"
        else
            echo -e "${CRED}-> ERREUR : N ${CEND}"
        fi
}

runDeveloppment() {
    Screen -mdS dev_env
    echo -e "${CCYAN}-> Démarage du serveur ${CEND}"
    npm run dev
    if [ $? == 0 ]; then
        echo -e "${CGREEN}-> Ok : V ${CEND}"
    else
        echo -e "${CRED}-> ERREUR : N ${CEND}"
    fi
}
