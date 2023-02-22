#!/bin/sh
# This script is run before the commit is made.

# Why do we render here, and on GitHub?
quarto render
cp -r posts/images docs/images