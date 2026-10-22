cmake_minimum_required(VERSION 3.15)
project(DiskScheduler LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add third-party single-header libraries
include_directories(/third_party)
include_directories(/include)

add_executable(DiskScheduler
    src/main.cpp
    src/algorithms.cpp
)

# Link libraries if needed (none for header-only libs)
