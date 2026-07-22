---
title: "Resource Management with Probabilistic Scheduling in Linux"
brief: "Deep technical blog exploring Linux kernel scheduling mechanisms and resource management algorithms."
dateAdded: 2024-11-01T00:00:00.000Z
hashnodeUrl: "https://rishi2220.hashnode.dev/resource-management-with-probabilistic-scheduling-in-the-context-of-linux"
readTimeInMinutes: 37
author: "Rishi Ahuja"
---
# Abstract

This paper/essay explores some topics of probabilistic scheduling and resource management in the context of the Linux operating system in depth. Because Linux powers a wide range of devices and applications, resource management is important for making sure that system resources are assigned and used effectively by the CPU and GPU.

To begin, This paper will give a general introduction to resource management concepts and how they apply to Linux. Next, this paper will turn into the idea of Linux scheduling, defining it, outlining the many kinds of old scheduling algorithms that are out there, and outlining the reasons that scheduling is essential to preserving optimal system performance.

After that, the essay turns to probabilistic scheduling methods including stride and lottery scheduling. We will explain how these new algorithms add randomness and prioritize decisions, which can enhance the processes’ ability to be carried out and let the CPU decide the allocation of memory even before the task is given making things more efficient.

However, putting these strategies into practice has its own set of difficulties. This paper will also discuss the challenges of incorporating probabilistic scheduling into current systems and the possible effects on real-time performance.

Lastly, there will be a discussion about potential future developments in this area, such as improvements in scheduling algorithms and some more opportunities presented by combining machine learning technology. These developments could lead to even greater Linux resource management optimization.

In conclusion, this essay offers a thorough analysis of how probabilistic scheduling might improve Linux resource management, providing insights into both present methods and upcoming advancements in this exciting field.

# 0\. Introduction & Prerequisites

## **0.1 Definition of Scheduling**

Scheduling in operating systems refers to the method by which processes are assigned CPU time and other resources. It plays a critical role in resource management by determining which process runs at any given moment, thereby influencing system performance, responsiveness, and overall efficiency.

At its core, scheduling ensures that the CPU is utilized effectively, allowing multiple processes to execute concurrently without conflicts. The scheduler manages this complexity by employing various algorithms that prioritize tasks based on specific criteria such as urgency, resource requirements, and fairness.

Different scheduling policies exist to cater to diverse workload needs, which will be discussed in the next chapter.

## 0.2 Process states

In operating systems, a **process** is a program in execution, and it can exist in various states throughout its lifecycle.

Here are some key process states:

*   **New (or Created):** This is the initial state of a process when it is first created. In this state, the process is being set up and initialized, but it has not yet been admitted to the ready queue for execution.
    
*   **Ready:** In the ready state, the process is loaded into the main memory and is waiting for CPU time to execute. It is prepared to run but cannot proceed until the scheduler allocates its CPU resources. Multiple processes can be in the ready state at the same time.
    
*   **Running:** When a process is allocated CPU time, it enters the running state. In this state, the process is actively executing its instructions. Only one process can be in the running state on a single CPU core at any given moment.
    
*   **Blocked (or Waiting):** A process enters the blocked state when it cannot continue executing because it is waiting for some event to occur, such as I/O completion or resource availability. While in this state, the process does not consume CPU resources.
    
*   **Terminated (or Exit):** Once a process has completed its execution or has been terminated by the operating system (due to errors or other reasons), it enters the terminated state. In this state, the operating system performs cleanup operations to free up resources that were allocated to the process.
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729347261202/6919864b-17ca-4984-946f-ef4e794b9b4e.png align="center")
    

## 0.3 **CPU Scheduling Criteria**

### 0.31 Understanding basic terms

*   **CPU Utilization:** CPU utilization refers to the percentage of time that the CPU is actively working on tasks versus being idle. It is a critical metric for assessing the performance and efficiency of a computing system.
    
    $$CPUutils = busytime / totaltime$$
    
*   **Burst time (BT):** Burst time refers to the total amount of time that a process requires on the CPU to complete its execution. It is sometimes referred to as execution time or running time and I/O waiting.
    
*   **Completion Time (CT):** Completion time is the total time at which a process finishes its execution. It marks the end of the process lifecycle.
    
*   **Arrival Time (AT):** Arrival time is the moment at which a process enters the ready queue and is ready for execution.
    
*   **Turnaround Time (TAT):** Turnaround time is the total time taken from the arrival of a process to its completion. It can be calculated using the formula:
    
    $$TAT=CompletionTime (CT) −Arrival Time (AT)$$
    
    The sum of spent time can be broken into 4 parts:
    
    *   Time to load in memory
        
    *   Time while waiting in the ready queue
        
    *   CPU execution — Burst time
        
    *   I/O — Burst time
        
    
    > Generally time to load in memory is 0, due to virtual memory called Swap in Linux. Further discussion about Swap is out of scope for this paper.
    
*   **Waiting Time (WT):** Waiting time is the total amount of time that a process spends in the ready queue before it gets CPU time. It can be calculated as:
    
    $$WT=TotalCompletionTime (TAT) − Total Burst Time (TBT)$$
    
    > Note that waiting state and waiting time are different from each other. WT refers to time for waiting in ready queue, while WS refers to state of I/O
    
*   **Response Time (RT):** Response time is the amount of time it takes from when a request is submitted until the first response is produced. This means the first response will be generated as soon as the process gets the CPU time. Simple, it’s the time spent in the ready queue for the first time.
    
    $$Response Time (RT) = Start Time(ST) - AT$$
    
*   **Throughput:** Throughput is a measure of the amount of data or number of tasks that a system can process in a given period. It reflects the efficiency of a system in handling workloads.
    
    $$T=Inventory/TimeInProduction$$
    

### 0.32 Gantt chart and Calculations

A Gantt chart provides a graphical representation of a project schedule. It displays tasks along a timeline, allowing one to see the start and end duration of each task. Here is an example of a Gantt chart.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729347304327/8f5b42f5-ad28-4012-8db3-ea4997e7c367.png align="center")

Here is a flowchart about a process, where for the first two seconds the CPU is idle, and for the next 1 second, the process is ready in the ready queue waiting for the scheduler to assign it to the CPU. Next five seconds, the CPU is running and then waits for some I/O and moves to the waiting state. The process again waits for the scheduler to be ready for one more second, then the process runs for the next 6 seconds and terminates.

Here are some calculations,

Turnaround time:

$$|TAT| = CT - AT = 20 -2 = 18$$

Waiting time:

$$|WT| = TAT - BT = 18 - [(8-3) + (13-8) + (20-14)] = 2$$

Response time:

$$RT= ST - AT = 3-2 = 1$$

CPU Utilization percentage:

$$CU = [[(8-3) + (20-14)] ÷ 20]×100 = 55$$

Throughput (processes/time):

$$Throughput = 1 ÷ (Max(CT) - Min(AT)) = 1/18$$

# **1\. Scheduling Algorithms in Linux**

As discussed earlier, Linux employs various scheduling algorithms to manage how processes access CPU time and other resources. Here are lists of some algorithms which will be discussed.

*   First-Come-First-Served (FCFS)
    
*   Shortest Job First (SJF)
    
*   Round Robin (RR)
    
*   Priority Scheduling (PS)
    

### 1.10 First-Come-First-Served (FCFS)

**1.11 What is FCFS?**

First-Come-First-Served (FCFS) is like waiting in line at a coffee shop. The first person to arrive gets served first, the second person gets served next, and so on. In the context of a CPU, processes (or tasks) that need to run are lined up in the order they arrive. The CPU works on the first task until it's finished before moving on to the next one.

**1.12 Expanding the working of FCFS**

1.  Process Arrival:
    
    *   When a process is created or arrives in the system, it is added to the end of a queue known as the ready queue. Each process has an associated arrival time that determines its position in this queue.
        
    *   For example, if Process A arrives at time 0, Process B arrives at time 1, and Process C arrives at time 2, they will be queued in that order.
        
2.  CPU Scheduling:
    
    *   The CPU scheduler selects the first process in line from the ready queue. This selection is based solely on the order of arrival, without considering any other factors like priority or burst time.
        
    *   Once a process is selected, the CPU allocates its resources to that process for execution.
        
3.  Execution Until Completion:
    
    *   The selected process runs until it either completes its execution or requests an I/O operation (like reading from a disk or waiting for user input).
        
    *   In FCFS scheduling, once a process starts executing, it cannot be interrupted by another process. This non-preemptive nature means that if a long-running process is at the front of the queue, shorter processes must wait until it finishes.
        
4.  Moving head to the next process:
    
    *   After the currently running process completes its task or requests I/O, the scheduler looks at the next process in line (the one that arrived next) and allocates CPU time to it.
        
    *   This cycle continues until all processes in the queue have been executed.
        

**1.13 Gantt Chart and Calculations**

| Processes | AT | BT |
| --- | --- | --- |
| P1 | 3 | 2 |
| P2 | 2 | 1 |
| P3 | 3 | 2 |
| P4 | 4 | 3 |
| P5 | 5 | 4 |

Here is the Gantt chart of the following processes:

* * *

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729347351432/3d1ce963-ee55-4a33-b8db-1ef03e5a292b.png align="center")

On the basis of the Gantt chart, we can calculate the ST, CT, TAT, WT, RT:

| Index | AT | BT | CT | TAT | WT | RT |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | 3 | 2 | 5 | 2 | 0 | 0 |
| P2 | 2 | 1 | 3 | 1 | 0 | 0 |
| P3 | 3 | 2 | 7 | 4 | 2 | 2 |
| P4 | 4 | 3 | 10 | 6 | 3 | 3 |
| P5 | 5 | 4 | 14 | 9 | 5 | 5 |
| Average |  |  |  | 4.4 | 2 | 2 |

**1.14 Efficiency and disadvantages**

*   The average waiting time under FCFS tends to be higher compared to other scheduling algorithms due to the convoy effect and lack of prioritization.
    

> Convoy effect refers to when a long-running process blocks shorter processes from executing, leading to increased waiting times for those shorter tasks. For example, if a long task is at the front of the queue, all subsequent tasks must wait for it to finish, regardless of their burst times.

*   The same reason is responsible for decreasing the throughput, or the number of processes completed in a given time frame, which can be low in FCFS systems, especially when long-running processes monopolize CPU resources.
    
*   Unlike some other scheduling algorithms, FCFS ensures that every process will eventually get a chance to execute. There is no starvation because once a process is in the queue, it will be executed after all preceding processes have been complete
    

### 1.20 Shortest Job First (SJF)

**1.21 What is SJF?**

Image the same coffee shop we talked about earlier, In the Shortest Job First (SJF) approach, the barista prioritizes making the quickest drinks first. For example, if Customer D orders an espresso that takes 3 minutes, Customer E orders a flat white for 4 minutes, and others order longer drinks, the barista will prepare the espresso first to get one customer served quickly. This method minimizes overall waiting time for all customers, as shorter orders are completed sooner. However, it can lead to longer waits for those with more time-consuming orders if new quick orders come in.

**1.22 Expanding the working of SJF**

*   Process Selection: In SJF, the scheduler examines all processes in the ready queue and selects the one with the shortest burst time to execute next. This means that if multiple processes are waiting, the one that can be completed the quickest is chosen first.
    
*   Non-Preemptive vs. Preemptive:
    
    *   Non-Preemptive SJF: Once a process starts executing, it runs to completion before any new process can take over, even if a shorter job arrives.
        
    *   Preemptive SJF (Shortest Remaining Time First - SRTF): \*\*\*\*If a new process arrives with a shorter burst time than the remaining time of the currently running process, the current process is paused, and the new process is executed.
        
*   Execution Order: The scheduler continuously checks for new arrivals and updates its list of processes. For example, if three processes arrive with burst times of 5, 2, and 3 seconds respectively, the scheduler will execute the one with a burst time of 2 seconds first.
    
*   Handling Ties: If two processes have the same burst time, they are scheduled based on their arrival order—similar to First-Come-First-Served (FCFS).
    

**1.23 Gantt Chart and Calculations—SJF**

| Process | AT | I/O BT | CPU BT | I/O BT |
| --- | --- | --- | --- | --- |
| P1 | 0 | 2 | 7 | 1 |
| P2 | 0 | 4 | 14 | 2 |
| P3 | 0 | 6 | 7 | 3 |

Here is the Gantt chart of the following processes:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729347365426/7bc631d8-445c-48b3-9fd0-a75a1a8932e9.png align="center")

Here we can see, the scheduler picked the process with less burst time first at the 9th millisecond.

| Process | AT | I/O BT | CPU BT | I/O BT | ST | CT | TAT | WT | RT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | 0 | 2 | 7 | 1 | 2 | 10 | 10 | 0 | 2 |
| P2 | 0 | 4 | 14 | 2 | 9 | 25 | 25 | 5 | 9 |
| P3 | 0 | 6 | 7 | 3 | 23 | 33 | 33 | 17 | 23 |
| Average |  |  |  |  |  |  | 22.67 | 7.33 | 11.34 |

CPU Utilization percentage:

$$CU = (total - idle) ÷ total = [(33 - (2 + 3)) ÷33] × 100 = 84.85$$

Throughput calculation:

$$TP = task ÷ (Max (CT) - Min(AT)) = 3÷(47-0) = 3/47$$

**1.24 Gantt Chart and Calculations—SRTF**

| Process | AT | BT |
| --- | --- | --- |
| P1 | 0 | 4 |
| P2 | 2 | 2 |
| P3 | 3 | 1 |
| P4 | 5 | 3 |
| P5 | 6 | 2 |

Here is the Gantt chart of the following processes:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729347383884/0c37948d-8c90-4933-b3cd-700200b02ba0.png align="center")

As P1 arrives, It will receive the scheduled time, as the second process P2 arrived at the second second, the burst time of P1 would have been reduced to 2 seconds, Now we have two processes with the same burst time, we have to follow FCFS, and provide CPU time to P1 as it has less arrival time. As the third process P3 arrives, at the third second, P1 will have a BT of 1, P2 will have a BT of 2 and P3 will have a BT of 1, hence again P1 will have CPU time as per FCFS. After six seconds, all the tasks would have arrived at the ready queue, hence the SRTF will convert to normal SJF

| Process | AT | BT | ST | CT | TAT | WT | RT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | 0 | 4 | 0 | 4 | 4 | 0 | 0 |
| P2 | 2 | 2 | 5 | 7 | 5 | 3 | 3 |
| P3 | 3 | 1 | 4 | 5 | 2 | 1 | 1 |
| P4 | 5 | 3 | 9 | 12 | 7 | 4 | 4 |
| P5 | 6 | 2 | 7 | 9 | 3 | 1 | 1 |
| Average |  |  |  |  | 4.2 | 1.8 | 1.8 |

CPU Utilization percentage:

$$CU = (total - idle) ÷ total = [12 ÷ 12] × 100 = 100$$

Throughput calculation:

$$TP = task ÷ (Max (CT) - Min(AT)) = 5 ÷ (12 -0) = 5/12$$

**1.25 Efficiency and disadvantages**

*   SJF is designed to minimize the average waiting time for a set of processes. Prioritizing shorter jobs, allows the CPU to complete tasks quickly, leading to improved overall throughput.
    
*   Longer processes may suffer from starvation if shorter processes continue to arrive, leading to indefinite waiting times for those longer tasks.
    
*   The need to track and estimate burst times can introduce additional overhead on the CPU, potentially affecting performance and increased overhead.
    

### 1.30 Robin Round (RR)

**1.31 What is RR?**

Round Robin (RR) is a preemptive (as discussed earlier, means a process can be interrupted in between to allot time to some another process) CPU scheduling algorithm designed to allocate CPU time slices (or quanta) to each process in a cyclic order. This method ensures that all processes receive an equal share of CPU time, making it particularly suitable for time-sharing systems.

**1.32 Expanding the working of RR**

1.  All processes are added to the ready queue.
    
2.  Each process is assigned a fixed time quantum. If a process's burst time is less than or equal to the quantum, it executes for its entire burst time. If it's greater, the process runs for the quantum duration and then returns to the ready queue.
    
3.  The CPU scheduler cycles through the ready queue, giving each process its turn based on the time quantum until all processes are completed.
    

**1.33 Understanding context switch and its overhead**

Context switch overhead refers to the time and resources consumed when the operating system switches the CPU from one process or thread to another. This process is essential in multitasking environments, allowing multiple processes to share a single CPU. However, it incurs costs as each context switch can take several milliseconds, during which no useful work is done. This time varies based on hardware architecture and operating system efficiency.

**1.34 How is the quanta calculated?**

The time quantum, also known as the time slice, determines how long each process can run before being preempted.

*   Fixed Time Quantum: In many implementations, the time quantum is set as a fixed value determined by the system administrator or based on empirical testing. This fixed quantum applies to all processes in the system.
    
*   Dynamic Time Quantum: Some advanced algorithms may calculate a dynamic time quantum based on the average burst time of all processes in the ready queue. For example, it can be determined using the formula, where `Pi` indicates the burst time of a process, and `n` represents the total number of processes:
    
    $$Quanta = (P\_1 +P\_2 +...+P\_n) ÷ n$$
    
*   Performance Considerations: The choice of time quantum affects system performance significantly:
    
    *   Shorter Quantum: Reduces response time but increases context switches, leading to overhead.
        
    *   Longer Quantum: Decreases context switches but may lead to longer waiting times for processes, resembling First-Come-First-Served (FCFS) behavior.
        
*   Empirical Testing: Often, the optimal time quantum is found through empirical testing to balance responsiveness and context-switching overhead. The goal is to choose a value that minimizes waiting and turnaround times while maximizing CPU utilization.
    

**1.35 Gantt Chart and Calculations**

| Process | AT | CPU BT | I/O BT | CPU BT |
| --- | --- | --- | --- | --- |
| P1 | 0 | 6 | 10 | 4 |
| P2 | 2 | 9 | 15 | 2 |
| P3 | 4 | 3 | 5 | 6 |

Here the Quantum time taken is 3ms.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729347443178/c96986ff-1bb7-4809-a2fc-b98afb8d0338.png align="center")

Here even if the burst of P1 is 6 seconds, we only gave CPU time of 3 seconds due to decided quanta being 3 seconds. Then as P2 is arrived at 2 seconds, and is waiting in the ready queue, the CPU time is next allotted to P2. Next, at 4 seconds, P3 arrives, but after a 3-second burst of P2, CPU time is allotted to P1, because that was in the ready queue before P3. At, 9 seconds, the burst of P1 completes and it starts an I/O burst. Other bursts and I/Os can be similarly observed in the above Gantt chart.

| Process | AT | CPU BT | I/O BT | CPU BT | ST | CT | TAT | WT | RT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | 0 | 6 | 10 | 4 | 0 | 24 | 24 | 4 | 0 |
| P2 | 2 | 9 | 15 | 2 | 3 | 39 | 37 | 7 | 1 |
| P3 | 4 | 3 | 5 | 6 | 9 | 20 | 16 | 6 | 5 |
| Average |  |  |  |  |  |  | 25.67 | 5.67 | 2 |

CPU Utilization percentage:

$$CU = [(total - idle) ÷ total] × 100 = [(39-9) ÷ 39] × 100 = 76.92$$

Throughput calculation:

$$TP = task ÷ (Max (CT) - Min(AT)) = 3 ÷ (20 -0) = 3/20$$

**1.36 Efficiency and disadvantages**

*   Each process receives an equal time slice, preventing any single process from monopolizing the CPU. This ensures that all tasks are included and completed in a timely manner, which is particularly beneficial in multi-user environments where multiple processes compete for resources.
    
*   RR scheduling tends to provide low response times, especially in systems with a mix of short and long processes. Shorter tasks can quickly complete their execution due to frequent CPU access, leading to improved user experience.
    
*   Frequent context switches can occur if the time quantum is too short, leading to increased overhead and reduced overall system efficiency. This overhead can negate the benefits gained from fairness in resource allocation.
    
*   Long-running processes may suffer from inefficiency due to being interrupted frequently. If a process requires more CPU time than allocated in a single quantum, it may experience delays, resulting in longer turnaround times
    

### 1.40 Priority Scheduling (PS)

**1.41 What is PS?**

To understand PS, with the ongoing example, we can simply make an analogy where in the coffee shop, customers are served based on how urgent their orders are.

**1.42 Expanding the working of PS**

*   Process Selection: Each task is given a priority level. Generally, Lower numbers mean higher priority. This can vary for different Operating systems.
    
*   In the context of this paper, Priorities are indicated by a fixed range. The Linux kernel implements a priority system with 39 priority levels \*\*\*\*for real-time tasks, where lower numbers indicate higher priority. This means that a process with priority -20 is the highest priority, while a process with priority 19 is the lowest.
    
    $$−20≤P≤19$$
    
*   The scheduler will always pick the task with the highest priority to run first. If two tasks have the same priority, the one that arrived first gets to go next, same as in FCFS.
    
*   SJF is essentially priority scheduling, where the burst time is considered a priority.
    
    > Every SJF is PS, but every PS is not SJF.
    
*   Priority scheduling can also be preemptive and non-preemptive, similar to SJF.
    

**1.43 Gantt Chart and Calculations—Non-preemptive**

| Process | Priority | AT | CPU BT | I/O BT | CPU BT |
| --- | --- | --- | --- | --- | --- |
| P1 | 2 | 0 | 6 | 10 | 4 |
| P2 | 1 | 2 | 9 | 15 | 6 |
| P3 | 3 | 3 | 3 | 5 | 2 |

Here is the Gantt chart of the following processes:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729347486920/9170f2dc-d498-48e8-880b-ef22964efe50.png align="center")

Here it can be seen that, at the 6th second, the CPU time is given based on the priority given in the table.

| Process | Priority | AT | CPU BT | I/O BT | CPU BT | ST | CT | TAT | WT | RT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | 2 | 0 | 6 | 10 | 4 | 0 | 21 | 21 | 1 | 0 |
| P2 | 1 | 2 | 9 | 15 | 6 | 6 | 36 | 34 | 4 | 4 |
| P3 | 3 | 3 | 3 | 5 | 2 | 15 | 25 | 22 | 12 | 12 |
| AVG |  |  |  |  |  |  |  | 25.6 | 5.67 | 5.34 |

CPU Utilization percentage:

$$CU = [(total - idle) ÷ total]× 100 = [(36 - (2 + 5)) ÷36] × 100 = 80.56$$

Throughput calculation:

$$TP = task ÷ (Max (CT) - Min(AT)) = 3÷(36-0) = 1/12$$

**1.44 Gantt Chart and Calculations—Preemptive**

| Process | Priority | AT | BT |
| --- | --- | --- | --- |
| P1 | 6 | 0 | 8 |
| P2 | 5 | 1 | 6 |
| P3 | 1 | 2 | 4 |
| P4 | 3 | 3 | 2 |
| P5 | 4 | 4 | 10 |
| P6 | 2 | 6 | 3 |

Here is the Gantt chart of the following processes:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729347511455/bb67eb38-0886-4041-859d-e8cbcc0fd684.png align="center")

As new tasks arrive in the queue, the scheduler performs context switches based on the priority they are provided with. This can be easily seen in the Gantt chart above.

| Process | Priority | AT | BT | ST | CT | TAT | WT | RT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | 6 | 0 | 8 | 0 | 33 | 33 | 25 | 0 |
| P2 | 5 | 1 | 6 | 1 | 26 | 25 | 19 | 0 |
| P3 | 1 | 2 | 4 | 2 | 6 | 4 | 0 | 0 |
| P4 | 3 | 3 | 2 | 9 | 11 | 8 | 6 | 6 |
| P5 | 4 | 4 | 10 | 11 | 21 | 17 | 13 | 7 |
| P6 | 2 | 6 | 3 | 6 | 9 | 3 | 0 | 0 |
| Average |  |  |  |  |  | 15 | 10.5 | 2.167 |

CPU Utilization percentage:

$$CU = [(total - idle) ÷ total]× 100 = [33 ÷ 33] × 100 = 100$$

Throughput calculation:

$$TP = task ÷ (Max (CT) - Min(AT)) = 6 ÷ (33 -0) = 2/11$$

**1.45 Efficiency and disadvantages**

*   Lower-priority processes may suffer from starvation if high-priority processes continuously consume CPU time. This can lead to indefinite waiting for low-priority tasks, as they may never get the chance to execute if higher-priority tasks keep arriving.
    
*   Managing priorities can add complexity to the scheduling algorithm, especially in systems with many competing processes. This complexity can lead to inefficiencies if not handled properly.
    
*   In preemptive systems, frequent context switching between high- and low-priority processes can lead to increased overhead, reducing overall system performance
    

**1.46 Getting out of Starvation**

To get out of Starvation, Aging can be implemented, Aging is a technique where the priority of waiting processes is gradually increased over time. This ensures that lower-priority processes eventually receive CPU time. For instance, if a process waits too long, its priority can be incremented regularly, making it more likely to be scheduled for execution.

However, The need to frequently update and manage priority levels can introduce additional overhead. This may slow down the overall system performance, especially in environments with a large number of processes where constant monitoring and adjustments are necessary.

# **2.** Probabilistic Scheduling Techniques

### 2.10 **Introduction to Probabilistic Scheduling**

Think of probabilistic scheduling like a game of chance at a carnival where different players (tasks) want to win a prize (CPU time). Each player gets a certain number of tickets, and the more tickets they have, the better their chances of being selected to play the game.

For example, if you have three players:

*   Player A has 5 tickets
    
*   Player B has 2 tickets
    
*   Player C has 1 ticket
    

When it’s time to choose who gets to play, the game randomly picks a ticket from the jar. Player A, with 5 tickets, is much more likely to be chosen than Player C, who only has 1 ticket. However, there’s still a chance for Player C to be picked, so everyone gets a fair shot. It’s simple probability.

*   Just like in our carnival game, every player gets a chance to win. This means that even if one player has fewer tickets (or less CPU time), they still have an opportunity to get picked. This prevents any single task from hogging all the CPU time and ensures that all tasks eventually get their turn.
    
*   Imagine if new players join the game or if some leave. The carnival can easily adjust how many tickets each player has based on what’s happening at that moment. If a new player comes in and is really important, they can be given more tickets right away.
    
*   The process is straightforward—just draw tickets randomly. There’s no need for complicated rules or calculations to decide who gets to play next. This makes it easier for the scheduler to manage tasks without getting overwhelmed.
    
*   As more players join or leave the game, the carnival can quickly change how many tickets each player has. This helps keep the game running smoothly and ensures that everyone has a chance to participate.
    

### 2.20 **Lottery Scheduling**

**2.21 What is Lottery Scheduling?**

It’s one of the probabilistic scheduling algorithms, with tickets as discussed above, and which gives a fair chance to run all the processes.

**2.22 Expanding how tickets are allocated**

*   Each process is assigned a certain number of lottery tickets, which can vary based on its priority level. Higher-priority processes typically receive more tickets than lower-priority ones. This means that the high-priority process has a greater chance of being selected for execution.
    
*   Static vs. Dynamic Distribution
    
    *   Static Distribution: The number of tickets in static distribution assigned to each process remains fixed over time. Once assigned, these tickets do not change unless the process is terminated or altered.
        
    *   Dynamic Distribution: Here, the ticket count changes based on the system's behavior and resource usage. For example, if a high-priority process is consuming too many resources and starving other processes, its ticket count may be reduced to give other processes a better chance of being selected.
        
*   Now, When it’s time to select a process for execution, the scheduler conducts a lottery by randomly selecting a ticket from the pool of all available tickets. The process that holds the winning ticket is chosen for execution. After execution, the ticket count for the winning process is decremented (reduced by one), reflecting that it has had its turn at the CPU.
    
*   After a process completes its execution or blocks (e.g., waiting for I/O), the system can adjust the number of tickets each process holds based on various factors such as performance metrics, resource usage, or user feedback.
    

The probability `P` of selecting process `i` can be expressed as, the number of tickets in the process `i` divided by the total number of processes `T`

$$P(i) = \frac{t_i}{T}$$

**2.23 Expanding the working of LS**

*   Once a process (e.g., Process C) is selected based on the winning lottery ticket, it is allowed to execute for a predetermined time slice. This time slice is often defined by the operating system and can vary based on system design or configuration.
    
*   For example, if the time slice is set to **20 milliseconds**, Process C will run for that duration.
    
*   During its execution, the process may complete its task, block for I/O operations, or yield voluntarily before the time slice expires. If it completes its execution, it will be removed from the scheduling pool. If it blocks (e.g., waiting for user input or I/O), it will not be eligible for selection until it becomes ready again.
    
*   After the time slice expires, whether the process has been completed or not, it will be preempted (if still running) to allow for fairness in scheduling. The scheduler then prepares for the next lottery draw.
    
*   The cycle repeats, ensuring that all processes have an opportunity to execute based on their ticket allocations.
    

**2.24 Simulating Random Draws and Statistical Analysis**

Let’s assume three processes with the following ticket allocations:

*   **Process A:** 5 tickets
    
*   **Process B:** 10 tickets
    
*   **Process C:** 15 tickets
    

Total Tickets (T):

$$T = 5+ 10 + 15 = 30$$

Probabilities of each task:

*   Probability for Process A:
    

$$P(A) = \frac{5}{30} = 0.1667$$

*   Probability for Process B:
    

$$P(B) = \frac{10}{30} = 0.33$$

*   Probability for Process C:
    

$$P(C) = \frac{15}{30} = 0.5$$

Frameworks like `matplotlib` in `python3` can be used to simulate the lottery draws, and we can see how Process C can enjoy CPU time the most because of the high number of tickets. The given chart is for 100 picks.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1730413077806/55d6e5cf-2064-44ef-a54e-ad3311a139a9.png align="center")

| Process | Picks | Expected values | Deviation |
| --- | --- | --- | --- |
| A | 14 | 16.67 | \-2.67 |
| B | 40 | 33.33 | +6.67 |
| C | 46 | 50 | \-4 |

The number of times a process is selected can be modeled as a binomial distribution because each draw is an independent trial with two possible outcomes (selected or not selected).

The probability mass function for a binomial distribution is given by:

$$P(X=k)=\binom{n}{k} p^k(1−p)^{n-k}$$

Variance calculation:

$$Var(X)=np(1−p)$$

*   `n` is the total number of trials (100).
    
*   `p` is the probability of success.
    

1.  Variance of process A:
    

$$Var(A)=100×0.1667×0.8333≈13.89$$

2.  Variance of process B:
    

$$Var(B)=100×0.3333×0.6667≈22.22$$

3.  Variance of process C
    

$$Var(C)=100×0.5×0.5=25$$

Similarly, the coefficient of variance can be calculated using using this formula:

$$CV=\frac{μ}{σ}$$

| Process | Picks | Expected values | Deviation | Variance | Coefficient of Variation |
| --- | --- | --- | --- | --- | --- |
| A | 14 | 16.67 | \-2.67 | 13.89 | 0.224 |
| B | 40 | 33.33 | +6.67 | 22.22 | 0.142 |
| C | 46 | 50 | \-4 | 25 | 0.1 |

A normal distribution can also be generated, not of this process, though for a stretched version, where processes are increased to a very large number, here is the graph plotted using `matplotlib`.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1730413195280/c9cd99ce-6b6e-4c2a-8551-9618de16c23c.png align="center")

**2.25 Efficiency—Key points**

*   Lottery scheduling involves generating random numbers to select the next process, which can introduce variability in overhead. However, the core mechanism is relatively lightweight, requiring only a random number generation and a simple traversal of the process list.
    
*   Lottery scheduling is highly adaptable and can handle dynamic changes in ticket allocations and the number of clients efficiently. This adaptability ensures that the system remains responsive to changing resource demands.
    
*   Although lottery scheduling is designed to prevent starvation by ensuring each process has a non-zero chance of being selected, there is still a theoretical risk of starvation if a process consistently loses the lottery. However, this is rare and typically mitigated by the large number of tickets and frequent lotteries
    

### 2.30 **Stride Scheduling**

**2.31 What is Lottery Scheduling?**

Stride scheduling is a deterministic scheduling algorithm designed to provide proportional-share resource allocation, particularly for processor time and other system resources.

**2.32 Expanding Stride Scheduling Works?**

*   Each process is assigned a **stride**, which is inversely proportional to the number of tickets it holds. For example, if a large number (e.g., 10,000) is used as a reference, the stride for a process with 100 tickets would be `10,000 / 100 = 100`.
    
*   Each process has a **pass value**, which is incremented by its stride each time it runs. The scheduler selects the process with the lowest pass value to run next.
    

**2.33 Algorithm Steps**

1.  Initialization:
    
    *   Calculate the stride for each process based on its ticket count.
        
    *   Initializing the pass value for each process to 0.
        
2.  Scheduling:
    
    *   The scheduler picks the process with the lowest pass value.
        
    *   The selected process runs for a time quantum or time slice.
        
    *   Its pass value is incremented by its stride.
        
    *   The process is then returned to the queue.
        
3.  Example:
    
    Consider three processes A, B, and C with ticket counts of 100, 50, and 250, respectively.
    
    *   Stride Calculation:
        
        *   Process A: `stride_A = 10,000 / 100 = 100`
            
        *   Process B: `stride_B = 10,000 / 50 = 200`
            
        *   Process C: `stride_C = 10,000 / 250 = 40`
            
    *   Pass Value Updates:
        
        *   Initially, all pass values are set to 0.
            
        *   After each execution, the pass value is updated by adding the stride.
            
        *   For instance, if Process A runs first, its pass value becomes 100. Then, if Process B runs next, its pass value becomes 200, and so on.
            
        
        | Pass (A) with stride = 100 | Pass (B) with stride = 200 | Pass (C) with stride = 40 | Allotted CPU Time |
        | --- | --- | --- | --- |
        | 0 | 0 | 0 | A |
        | 100 | 0 | 0 | B |
        | 100 | 200 | 0 | C |
        | 100 | 200 | 40 | C |
        | 100 | 200 | 80 | C |
        | 100 | 200 | 120 | A |
        | 200 | 200 | 120 | C |
        | 200 | 200 | 160 | C |
        | 200 | 200 | 200 | A |
        | 300 | 200 | 200 | … |
        
    
    **2.34 Efficiency—Key points**
    
    *   Stride scheduling is deterministic, meaning it provides strict predictability in the order of process execution. This predictability ensures that processes run in a consistent and predictable manner.
        
    *   Stride scheduling achieves significantly improved accuracy over relative throughput rates compared to lottery scheduling. It also reduces response time variability, making it suitable for systems requiring low latency and high predictability
        
    
    **2.35 Concluding points—Comparison Table**
    
    To compare the performance and suitability of different scheduling algorithms, the following table summarizes their key characteristics:
    
    | Algorithm | **CPU Utilization** | **Throughput** | **WT** | **RT** | **Fairness** |
    | --- | --- | --- | --- | --- | --- |
    | Lottery Scheduling | High, variable | High, variable | Variable | Variable | High |
    | Stride Scheduling | Consistent | Consistent | Low | Low | High |
    | FCFS | Variable | Variable | High | High | Low |
    | SJF | Variable | Variable | Low (average) | Low (average) | Low |
    | RR | Consistent | Consistent | Medium | Medium | High |
    | PS | High (for high-priority tasks) | High (for high-priority tasks) | High (for low-priority tasks) | High (for low-priority tasks) | Low |
    
    *   From the table above, it is clear that probabilistic algorithms like lottery and stride scheduling offer unique advantages in terms of fairness and adaptability. Lottery scheduling is particularly suited for multi-user environments where dynamic resource allocation is necessary, while stride scheduling is ideal for real-time systems requiring strict determinism.
        
    *   Traditional algorithms like FCFS and SJF are more suitable for systems with fixed or predictable workloads, while RR is better for interactive systems requiring good response times. Priority scheduling is essential in real-time systems where high-priority tasks must meet strict deadlines.
        

## Chapter 3: Future Directions

### 3.1 Advancements in Scheduling Algorithms

As technology continues to evolve and computing demands become more complex, there is a constant need for advancements and innovations in scheduling algorithms. Here are some future directions for probabilistic scheduling algorithms, particularly in the context of Linux systems.

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">Rudimentary implementations of the given algorithms are already available, Interested readers are provided with a direction to explore more in this chapter.</div>
</div>

**3.11 Hybrid Scheduling Algorithms**

Future research could focus on developing hybrid algorithms that combine the benefits of probabilistic scheduling (like lottery and stride scheduling) with the predictability of deterministic algorithms. This could involve using lottery scheduling for general-purpose tasks and stride scheduling for real-time tasks or integrating elements of both into a single scheduler.

**3.12 Adaptive Scheduling**

Adaptive scheduling algorithms that adjust ticket counts or strides based on system load and performance metrics can enhance the responsiveness and efficiency of the system. These algorithms can use feedback mechanisms to dynamically adjust resource allocations in real time, ensuring optimal performance under varying conditions.

**3.13 Multi-Core and Distributed Systems**

As systems become increasingly multi-core and distributed, scheduling algorithms need to scale accordingly. Future advancements could focus on extending probabilistic scheduling to efficiently manage resources in these complex environments, ensuring fairness and efficiency across multiple cores and nodes.

**3.14 Energy-Aware Scheduling**

With the growing concern for energy efficiency, future scheduling algorithms might incorporate energy-aware strategies. This could involve probabilistic scheduling techniques that optimize resource allocation to minimize energy consumption while maintaining performance.

### 3.2 Future Research Directions

**3.21 Real-Time Systems and Fault Tolerance**

Future research could focus on integrating fault-tolerant mechanisms into probabilistic scheduling algorithms. This involves developing schedulers that can tolerate transient task failures and ensure timely recovery from faults, especially in real-time systems.

**3.22 Cloud and Edge Computing**

As cloud and edge computing become more prevalent, there is a need for scalable scheduling algorithms that can efficiently manage resources in these environments. Probabilistic scheduling algorithms can be adapted to handle the dynamic nature of cloud and edge computing workloads.

### 3.3 Conclusion

In conclusion, the future of probabilistic scheduling in Linux is promising, with potential advancements in hybrid algorithms, adaptive scheduling, and integration with machine learning. These innovations will help address the growing demands of modern computing environments, ensuring that resource management remains efficient, fair, and responsive.

### Ending Note

This blog post serves as the first installment of a planned series on scheduling algorithms. We have focused on essential prerequisites and non-probabilistic scheduling methods such as FCFS, SJF, and RR, and PS. These algorithms are vital for managing CPU resources effectively and ensuring that processes are executed in an orderly manner.

Looking forward, subsequent posts will delve into probabilistic scheduling algorithms, which introduce a different approach to managing process execution based on statistical methods. Following this discussion, we will also provide insights into the implementation of these algorithms within Unix/Linux environments, showcasing practical applications and real-world examples.

Stay tuned for these upcoming discussions as we continue to unravel the intricacies of scheduling algorithms and their impact on system performance.

You can download the PDF format for the above blog at [Gumroad](https://rishiahuja.gumroad.com/l/rmwps).

Feel free to connect with me on my social media platforms:

*   [X](https://x.com/rishi2220)
    
*   [LinkedIn](https://www.linkedin.com/in/rishi-ahuja-b1a224310/).
    

Your thoughts and feedback are always appreciated!