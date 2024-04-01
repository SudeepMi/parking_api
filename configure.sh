#!/bin/bash

prompt_exit() {
  read -p "Press Enter to continue, or 'c' to exit..."
  if [[ "$REPLY" == "c" || "$REPLY" == "C" ]]; then
    echo "Exiting..."
    exit
  fi
}

while true; do
  echo "What would you like to do? (Enter the number)"

  echo "1. Create an admin"
  echo "2. Add parking spots to the database"

  echo "Press 'c' and Enter to exit or any other key to continue..."

  read choice

  case $choice in
    1)
      node "src/scripts/create-admin.js"
      prompt_exit
      ;;
    2)
      node "src/scripts/add-spots.js"
      prompt_exit
      ;;
    c|C)
      echo "Exiting..."
      exit
      ;;
    *)
      echo "Invalid input, please try again."
      ;;
  esac

done
