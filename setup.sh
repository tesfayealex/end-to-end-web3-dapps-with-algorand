#!/usr/bin/env python

"""The setup script."""

from setuptools import setup, find_packages

with open('README.md') as readme_file:
    readme = readme_file.read()

requirements = []

test_requirements = ['pytest>=3', ]

setup(
    author="Tesfaye Alemayehu",
    email="tesfayealemayehu27@gmail.com",
    python_requires='>=3.6',
    classifiers=[
        'Natural Language :: English',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
    ],
    description="A Repository for End To End Web 3",
    install_requires=requirements,
    long_description=readme,
    include_package_data=True,
    keywords='tests',
    name='tests',
    packages=find_packages(include=[]),
    test_suite='tests',
    tests_require=test_requirements,
    url='https://github.com/tesfayealex/end-to-end-web3-dapps-with-algorand.git',
    version='0.1.0',
    zip_safe=False,
)