#!/bin/bash

msg() {
    echo -e "\e[1;32m$1\e[0m"
}

msg "Stopping containers"
sudo docker compose down

msg "Starting containers"

sudo docker compose up -d