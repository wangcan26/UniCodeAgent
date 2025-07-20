#!/bin/bash

# This script removes all files and directories starting with a dot (.)
# from the current directory and its subdirectories.
# It excludes the .git and .trae directories to prevent breaking version control or project configuration.

echo "Starting cleanup of dotfiles..."

find . -mindepth 1 -type f -name '.*' -not -path './.git/*' -not -path './.trae/*' -not -name '.git' -not -name '.trae' -not -name '.gitignore' -not -name '.env' -exec rm -f {} +

echo "Cleanup complete."
