import argparse
import os
import sys

parser = argparse.ArgumentParser()

parser.add_argument(
    'LANG_FROM_PIPELINE', 
    type=str, 
)
args, unknown = parser.parse_known_args()
x = args.LANG_FROM_PIPELINE




print(x)