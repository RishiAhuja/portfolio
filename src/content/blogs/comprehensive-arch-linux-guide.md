---
title: "Comprehensive Arch Linux Blog"
brief: "In-depth technical guide covering Arch Linux installation, configuration, and advanced system administration."
dateAdded: 2024-08-16T00:00:00.000Z
hashnodeUrl: "https://rishi2220.hashnode.dev/comprehensive-arch-linux-guide"
readTimeInMinutes: 28
author: "Rishi Ahuja"
---
Linux distributions can be largely classified under three umbrellas:

*   Debian-Based
    
*   Arch-Based
    
*   RedHat-Based
    

Philosophically, Debian-based systems prioritize stability, Arch-based systems focus on simplicity, minimalism, and user control, while RedHat-based systems are designed for enterprise-grade reliability and long-term support.

### Knowing about Arch

Arch adheres to the "Keep It Simple, Stupid" (KISS) principle.

Key features:

*   **Rolling release model (RRM):**
    
    *   In a rolling release system, updates are rolled out incrementally. Users can update their software anytime to access the latest version, ensuring they always have the latest features and fixes.
        
    *   This contrasts with point release models (Debian), where users must wait for a new version, often requiring a significant upgrade process.
        
    *   Unlike traditional software releases identified by version numbers, rolling releases typically do not have specific version designations. Instead, they are continuously updated, which means that the software is always in a state of evolution.
        
*   **Highly customizable and detailed docs:**
    
    *   Users have complete control over their installations, from desktop environments to individual software packages.
        
    *   The Arch Wiki is renowned for its comprehensive documentation, which serves as a valuable resource for troubleshooting and learning about the system.
        
*   **Arch User Repository (AUR)**:
    
    *   The AUR is a community-driven repository for Arch Linux users, providing a vast collection of packages
        
    *   Unlike traditional repositories where a central authority manages packages, the AUR relies on a decentralized community.
        

### Prerequisites and my tools

I use an i5-12450HX processor with an RTX 3050, dual-booting Linux Mint and Windows 11. I was initially worried about installing Arch, so I found an old i5 3rd-gen laptop with 4GB RAM and decided to use that to avoid any data loss from my daily driver.

Initially, the laptop was using Windows 10, though it was installed on the laptop in `legacy` mode. To know more about the difference between the boot sequence of `legacy BIOS` & `UEFI` system, I made [an X post](https://x.com/Rishi2220/status/1822329239523443085) where you can find more. I used a prebuilt Windows tool for the conversion of `legacy BIOS` to `UEFI` without reinstalling Windows, called `mbr2gpt` linked [here](https://learn.microsoft.com/en-us/windows/deployment/mbr-to-gpt).

The next step was to flash a USB to boot Arch in a live session after downloading the [ISO](https://archlinux.org/download/).

Earlier I used tools like [Rufus](https://rufus.ie/en/) and [BalenaEtcher](https://etcher.balena.io/), But this time I tried [Ventoy](https://www.ventoy.net/en/index.html). With Ventoy, as the website states:

> you don't need to format the disk over and over, you just need to copy the ISO/WIM/IMG/VHD(x)/EFI files to the USB drive and boot them directly.

After opening `Ventoy2Disk.exe`, It looks something like this:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723657070375/2ab41d39-52b9-48ff-a61a-5b7886d27042.png align="center")

You just need to install the Ventoy firmware once on the bootable drive, and then you can just drag and drop your `iso`, once you boot into live USB, you will be greeted with a choice to select the `iso`'s awaiting to be booted. Changing the boot sequence from the `BIOS` is different for different motherboard manufacturers. The following needs to be researched by the reader.

[![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723656867014/8e8ddad0-b4a9-49e3-b20a-c164852058e6.png align="center")](https://www.linuxuprising.com/2021/04/ventoy-bootable-usb-creator-adds.html)

After booting into Arch, a terminal-based environment formally called, **Arch Linux Live Environment** will be expecting input:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723657755628/84c7db76-33c4-40e9-9212-601f18e3a187.png align="center")

From now on, I will introduce different commands, and try explaining each command and its arguments in detail.

### Setting fonts

```powershell
setfont ter-132n
```

`setfont` is a command-line utility in Linux that allows you to set or change the font used in the terminal as the name suggests.

`ter` is a prefix that stands for **Terminus**, which is the name of the font family. This is the default font used in the Arch Linux live environment. You can find other fonts which can be listed in the following directory.

```powershell
ls /usr/share/kbd/consolefonts
```

*   The **132** indicates that the font is designed to allow for **132 characters per line** in the terminal.
    
*   The font size for `ter-132n` is typically **12x24 pixels**, meaning each character is approximately 12 pixels wide and 24 pixels tall.
    
*   The Terminus font family has predefined sizes, such as:
    
    *   6x12
        
    *   8x14
        
    *   10x18
        
    *   **12x24** (which corresponds to `ter-132n`)
        
    *   14x28
        
    *   16x32
        
*   This suffix `n` indicates the **normal** (non-bold) style of the font.
    

### Connecting to Internet

During the whole process, I suggest connecting the device to Ethernet or using USB tethering from your mobile device. The established connection can be checked via pinging a website using `ping` command.

```powershell
ping google.com
```

Understanding the following command brief and layman terms:

ICMP: **Internet Control Message Protocol** is a network protocol used by devices to communicate information regarding data transmission over a network.

Imagine you want to send a message to a friend who lives far away. You put the message in an envelope and write your friend's address on it. This envelope is like the **ICMP echo request** packet that the ping command sends to [google.com](http://google.com).

When your friend receives the envelope, they read the message and write back a reply. They put the reply in a new envelope and send it back to you. This is like the **ICMP echo reply** that [google.com](http://google.com) sends back to your computer.

The ping command measures how long it takes for the message to go from your computer to [google.com](http://google.com) and back. This time is called the round-trip time and is measured in milliseconds (ms). It's like how long it takes for your friend to receive your message, write a reply, and send it back to you.

The requests and replies can be interrupted by pressing `ctrl+c`, this is called `SIGNIT` (Signal Interrupt) command.

*NOTE: Unix-based systems like Arch provide a facility called* `iwctl` *to allows users to manage wireless network connections, including scanning for networks, connecting to them, and viewing network information, if you want to use Wi-fi for the process.* [*Linked here*](https://man.archlinux.org/man/extra/iwd/iwctl.1.en) *for more information.*

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723660885208/10c1e0aa-ba99-493b-85cb-191936133dba.png align="center")

### Pacman basics and synchronizing databases

```powershell
pacman -Sy
```

*   Pacman is the package manager for Arch Linux. It is used to install, remove, upgrade, and manage software packages on the system. Pacman keeps a local database of installed packages and their versions.
    
*   `-S` tells Pacman to synchronize the local package database with the remote repository databases.
    
*   `-y` forces Pacman to download a fresh copy of the package database from the remote repositories.
    

So, `pacman -Sy` does the following:

1.  It synchronizes the local package database with the remote repositories.
    
2.  It downloads a fresh copy of the package database, ensuring that the local database has the latest information about available packages and their versions.
    

**Purpose of synchronizing packages:**

After setting up the system and configuring the fonts and network, it's important to synchronize the package database before installing any packages. This ensures that Pacman has access to the latest package information and can install the correct versions of packages.

If you try to install a package without first synchronizing the database, Pacman will use the outdated local database, which may result in installing an older version of the package or even failing to find the package at all.

We currently have no packages installed, though a command `pacman -Syu` can be used later/after the installation, where `u` stands for upgrading all the installed packages to the latest version.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723662160984/1f2d557d-71c1-4c11-b97f-e316680830a8.png align="center")

### Arch keyrings

```powershell
pacman -Sy archlinux-keyring
```

The following command is being used to upgrade the `archlinux-keyring` package. This package contains the necessary keys to verify the authenticity of packages from the Arch Linux repositories, ensuring that your system remains secure and that the software you install is legitimate. These keys are called OpenPGP keys.

PGP(Pretty good privacy) is a data encryption and decryption program that provides cryptographic privacy and authentication for data communication.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723662791028/13280126-a4c5-4553-97e1-6e9371efcb8c.png align="center")

### Understanding `lsblk` and block devices

`lsblk` (aka list block) is a command-line utility that displays information about block devices and partitions in a tree-like format.

Let's understand block devices in brief:

*   Imagine a bookshelf where each shelf holds a certain number of books. Each book represents a block of data. Just like you can easily grab any book from the shelf without having to take out all the others, block devices allow computers to access data quickly and directly.
    
*   Block devices store data in fixed-size pieces called blocks. Each block can typically hold a certain amount of data, like 4 kilobytes. This is similar to how a book can hold a certain number of pages.
    
*   You can access any block of data directly without having to go through the blocks in order. This is like being able to pull any book off the shelf without needing to read the ones in front of it first. This makes it fast to find and use the data you need.
    
*   HDDs, SSDs, USB drives, and memory cards are block devices.
    

hence `lbslk` provides a concise overview of the storage hierarchy, making it easy to visualize the relationships between different block devices.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723667454499/8263106e-3f55-4eba-aa6d-39cddd6d5183.png align="center")

The output omits three block devices:

1.  `loop0`
    
2.  `sda`
    
3.  `sr0`
    

Let's explain each one:

`loop0`:

*   Imagine you have a file on your computer that contains a bunch of files and folders, like a zip file. **loop0** allows your computer to treat that file as if it were a separate disk, so you can open and use the files inside it without burning it into a real disk. Hence essentially, here, the live USB plugged into the PC is converted as a virtual block device called `loop0`.
    
*   `/run/archiso/airootfs` is a mount point for `loop0` block.
    
*   `/run/archiso` is a temporary directory created by the Arch live environment during boot. The `airootfs` (Arch ISO root filesystem) is where the actual files of the live system are located.
    

`sda`:

*   is the primary block device that represents the first hard disk drive detected by the Arch live environment.
    
*   The "sd" prefix is used for SCSI-style block devices, which include disks connected via SATA, or USB, and even some virtual disk interfaces, like hard drives or SATA SSDs. NVME SSDs will be mentioned as `nvme0n1`
    
*   The "a" at the end indicates that this is the first detected disk. If there were multiple disks, they would be named `sdb`, `sdc`, and so on in alphabetical order.
    

`sr0`:

*   The `sr0` device likely is the actual USB device and not a virtual block like `loop0`, notice how the size of this block is 1.1GB which is also the size of the Arch iso.
    
*   The `bootmnt` subdirectory within `/run/archiso` is specifically used to mount the contents of the live ISO image
    

Understanding the `RM` (Removeable) and `RO` (Read only) column in the output:

*   The **RM** column indicates whether the device is removable or not.
    
*   A value of **0** means the device is not removable, like a regular hard disk drive (HDD) or solid-state drive (SSD).
    
*   A value of **1** means the device is removable, like a USB drive or memory card
    
*   Similarly, the **RO** column in the output indicates the read-only status of the block devices. Where 1 indicates the device is read-only like `loop0` and 0 indicates the device's content is editable, like a hard-drive/`sda`.
    

Understanding `MAJ:MIN` column in `lsblk` output:

*   Imagine you have a big library with many different types of books - history books, science books, fiction books, and so on. Each type of book has a unique number assigned to it, like 100 for history books, 200 for science books, and so on. These numbers are like the "major numbers" in the `MAJ:MIN` column.
    
*   Now, within each type of book, there are individual books with their own numbers. For example, in the history section, you might have book #1, book #2, book #3, and so on. These individual numbers are like the "minor numbers" in the `MAJ:MIN` column.
    
*   So, when you want to find a specific book in the library, you first look for the type of book (the major number), and then you look for the individual book within that type (the minor number). Similarly, in your computer, the major number tells the system what type of device it is (like a hard drive, USB drive, or CD/DVD drive), and the minor number tells it which specific device it is (like the first hard drive, second hard drive, or first CD drive).
    
*   In this context, 7 is assigned for virtual devices, 8 is assigned for commonly used for SCSI and SATA disks. 11 is used for USB or CD/DVD drives.
    

### Knowing about partitions

We have to create 3 partitions out of the free space available for UEFI-based installation. (here I'm using a Virtual machine for demonstration, hence you might not find Windows partitions on the screenshots.)

**Partitions to be created:**

1.  EFI System Partition (ESP)
    
2.  Linux Filesystem Partition
    
3.  Swap Partition
    

**EFI System Partition (ESP):**

*   The **EFI system partition** is a small partition (typically 800MB to 1GB) that is formatted with the FAT32 file system (which is a file system used for simpler partitions storing limited and relatively fixed data, It can only store a maximum of 4GB file.).
    
*   It is used with UEFI firmware to store bootloaders, kernel images, and other files needed for booting the operating system.
    

Linux Filesystem Partition

*   This partition will be used to install the Arch Linux operating system and store all the files with a recommended size of 40GB.
    
*   It is typically formatted with a Linux-native file system like ext4. (ext4 is a file system that organizes and manages files on storage devices in Linux.)
    

Swap Partition

*   The swap partition is used as virtual memory by the operating system when the physical RAM is full.
    
*   It acts as an overflow area, allowing the system to continue functioning smoothly when memory usage is high.
    
*   The recommended size for the swap partition varies based on factors like available disk space and amount of RAM:
    
    *   If you have 4GB or less RAM, set the swap partition size to 2-4 times the amount of RAM.
        
    *   If you have more than 4GB RAM, 4-8GB of swap is usually sufficient.
        

### Creating partitions

For creating partitions, majorly we have 2 pre-built utilities, `cfdisk` and `fdisk`.

The major difference between `fdisk` and `cfdisk` is that `fdisk` is a command-line utility with a text-based interface that uses single-letter commands for partition management, while `cfdisk` provides a more user-friendly, curses-based graphical interface that allows users to manage partitions visually. Using `cfdisk` Is relatively easy, hence in the blog we will be using `fdisk` utility.

**Partitioning with** `fdisk`:

```powershell
fdisk /dev/sda
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723709065632/3b26184e-59f7-49d9-8f75-e0103ae953a3.png align="center")

After starting the `fdisk` utility to partition the hard drive/`sda` the utility will be expecting a single-letter command, and `m` can be pressed to state all the options available.

```powershell
Command action
  a   toggle a bootable flag
  b   edit bsd disklabel
  c   toggle the dos compatibility flag
  d   delete a partition
  g   create a new empty GPT partition table
  G   create a new empty SGI (IRIX) partition table
  l   list known partition types
  m   print this menu
  n   add a new partition
  o   create a new empty DOS partition table
  p   print the partition table
  q   quit without saving changes
  s   create a new empty Sun disklabel
  t   change a partition type
  u   change display/entry units
  v   verify the partition table
  w   write table to disk and exit
  x   extra functionality (experts only)
```

We only want to use very limited functionalities of the tool.

**Understanding primary, extended, and logical partitions in brief:**

*   A primary partition is a type of partition that can contain a file system and can be used to boot an operating system. In MBR (legacy) systems you can only create 4 primary partitions, but GPT (UEFI) systems allow 128 primary partitions.
    
*   After exhausting primary partitions, you can create a single extended partition. and then further create multiple logical partitions in an extended partition.
    
*   Extended partitions can overcome the limitations of creating 4 or 128 partitions like in primary partition, though these can only be used to store data, and can be used to boot an operating system
    
*   after knowing about all the partitions, we can easily conclude that all the 3 partitions we are trying to create are primary in nature.
    
*   Here is an infographic I made for better understanding:
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723713620570/f36ebdbd-fe16-4c6b-b4f9-2c301a1ab58d.png align="center")

**Understanding the First and Last sectors of a partition in brief:**

As we are understanding everything in terms of books, let's continue the trend.

Think of your hard drive as a big book. Each page in the book is like a "sector." The **first sector** is the very first page where your new chapter (partition) will start. When you create a new chapter, if you don’t specify a page number, the computer will automatically choose the next available page after the last chapter. This way, you don’t accidentally start writing in the middle of an existing chapter.

The last sector is the page where your new chapter will end. It tells the computer how many pages (or space) your chapter will take up. You can say, “I want my chapter to be 5 pages long.” If you do that, the computer will figure out which page to end on based on how long you want it to be. If you just hit Enter without saying anything, it will take all the remaining pages from the starting point until the end of the book.

Now that we have established these terms, we can start creating partitions.

**Creating partitions with** `fdisk` **(ESP, swap, Linux file system):**

*   Create a new partition by pressing `n`
    
*   Now press `p` to create a primary partition.
    
*   For the first sector, press Enter to use the default value.
    
*   For the last sector, specify the size of the ESP. `+800M` or `+1G` is recommended.
    
*   Now press `t` to change the partition type, because by default the partition is of a Linux file system, However, we want an EFI system partition.
    
*   Enter the partition number you just created or just press enter to choose the last partition created, then type `EF` code for the EFI system partition and press Enter.
    
*   Write the changes to the disk by pressing `w`
    
*   Now repeat the whole process and change the sizes for Swap and Linux file system partitions with code `82` and `83` respectively.
    
*   Now run `lsblk` to review the changes.
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723714614202/8f94b214-d0f9-4096-b751-09c2c87b9b51.png align="center")
    

### Formatting partitions

**Formatting EFI system partition:**

```powershell
mkfs.fat -F32 /dev/sda1
```

Let's break this down:

*   `mkfs.fat`: This is the command to create a new file system on a partition. `mkfs` stands for "make file system."
    
*   `-F32`: This option tells `mkfs.fat` to create a FAT32 file system. The `F` stands for "format" and `32` specifies the 32-bit version of FAT.
    
*   `/dev/sda1`: This is the device path of the EFI partition we created earlier. It will be different if your disk is named differently or if we created the partition on a different disk.
    

**Formatting Linux file system partition:**

```powershell
mkfs.ext4 /dev/sda2
```

*   `mkfs.ext4`: is used to create an ext4 filesystem on a specified partition. The **ext4** filesystem is one of the most commonly used filesystems in Linux due to its performance, reliability, and support for large files and volumes.
    
*   `/dev/sda2`: This is the partition that we previously created to store the Linux filesystem.
    

**Formatting Swap partition:**

```powershell
mkswap /dev/sda3
```

*   `mkswap`: is used to create a Linux swap area on a specified partition.
    
*   `/dev/sda3`: This specifies the partition that you want to use as Swap.
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723715453067/d2c2763c-bf8b-4273-848a-b6e049847975.png align="center")
    

### Mounting partitions

Mounting allows the operating system to access files stored on external devices (like USB drives or hard drives) by integrating them into the Linux filesystem hierarchy. Without mounting, the system would not be able to read or write data on these devices.

```powershell
mount /dev/sda2 /mnt
```

Here we are mounting the Linux file system to `/mnt` which is a standard mount point used for temporarily mounting filesystems.

After mounting we shall mount the EFI system partition under `/mnt/boot`. The access to the EFI filesystem is temporary and can be easily unmounted when no longer needed. This keeps the filesystem organized and prevents cluttering the main directory structure.

```powershell
mkdir /mnt/boot
```

```powershell
mount /dev/sda1 /mnt/boot
```

Now we need to enable the Swap partition by using `swapon`:

```powershell
swapon /dev/sda3
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723718659045/5ff52171-c9dc-4807-8a5c-cc9f26fab8c6.png align="center")

### Installing Arch Linux

Now we can install Arch Linux kernel and other tools into the root partition which is mounted to `/mnt`.

```powershell
pacstrap -i /mnt base base-devel linux linux-firmware
```

Command breakdown:

`pacstrap`: is a script provided by Arch Linux that simplifies the installation of packages into a new root filesystem. It installs the specified packages into the directory specified (here, `/mnt`), which is the root partition where Arch Linux will be installed.

`-i`: The `-i` option stands for "interactive." By using this, `pacstrap` will prompt the user for confirmation before proceeding with the installation of each package. writing `-i` can be skipped for non-interactive installation.

packages:

*   `base`: This is the essential package group that contains the core components of Arch Linux, including basic utilities and libraries needed for the system to function.
    
*   `base-devel`: his group includes development tools and libraries that are essential for compiling software from source. It contains tools like `gcc`, `make`, and `automake`
    
*   `linux` and `linux-firmware`: This package installs the Linux kernel and firmware, which is the core of the operating system. It is necessary for the system to boot and operate.
    
*   Other packages can also be installed while installing the core firmware, though the system can boot without others, some of the tools I preinstall:
    

```powershell
git sudo intel-ucode htop neofetch nano vim bluez bluez-utils networkmanager
```

### Generating `fstab` (filesystem table) file

```powershell
genfstab -U /mnt >> /mnt/etc/fstab
```

*   `genfstab` is a utility that generates a `fstab` file based on the currently mounted filesystems. The `fstab` file is used by the system to define how disk partitions, filesystems, and swap space should be mounted at boot time. The partitions that we recently mounted are temporarily mounted, and shutting down the computer will not mount them again unless a `fstab` file is generated.
    
*   The `-U` option tells `genfstab` to use UUIDs (Universally Unique Identifiers) for the filesystems instead of device names (like `/dev/sda1`).
    
*   Using UUIDs is preferred because they uniquely identify filesystems regardless of the order in which devices are detected by the system. This helps prevent issues with incorrect device assignments during boot.
    
*   `/mnt` specifies the directory where the current root filesystem is mounted. In this case, it indicates that the command should generate the `fstab` entries based on the filesystems found under `/mnt`.
    
*   The `>>` operator appends the output of the `genfstab` command to the file located at `/mnt/etc/fstab`.
    
*   `/etc` known as the directory to find all the system's configuration files. It is now primarily reserved for configuration files.
    
*   If the file does not exist, it will be created. If it does exist, the new entries will be added to the end of the file.
    

After generating we can view the contents of the `fstab` file by using `cat`

```powershell
cat /mnt/etc/fstab
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723726780338/49b7ac08-6bda-4cb4-8a97-645ee4c380d9.png align="center")

### Chrooting into Installed Arch

```powershell
arch-chroot /mnt
```

`chroot` is a command in Unix-like operating systems that allows you to change the root directory of a process and its children.

Think of your computer's filesystem like a big house with many rooms (directories). When you install Arch Linux, you create a new room in that house, which is where the new operating system will live. In this case, that room is the `/mnt` directory.

The command `arch-chroot /mnt` is like saying, "I want to go inside the new room (the Arch Linux installation) and start working there." When you run this command, you are telling your computer to treat the `/mnt` directory as the main room (the root) for everything you do next.

Now you can use `neofetch` if installed and verify the correct installation of Linux kernel and firmware

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723727235026/1598a940-6795-4a3c-bda1-3601f9152939.png align="center")

### Adding a standard user

Now we can set a password for the root user. The root user is the superuser or administrator of the system. This account has full control over the system and can perform any action, such as installing software, changing system settings, and managing user accounts.

```powershell
passwd
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723727483468/53b95680-d38c-4d8d-a94c-c1afc4ac3fab.png align="center")

**Adding a user:**

```powershell
useradd -m -g users -G wheel,storage,power,audio,video -s /bin/bash rishi
```

Breaking down the command:

`useradd`: This is the command used to create a new user account in Linux.

`-m`: This option tells the system to create a home directory for the new user. The home directory will typically be located at `/home/YOUR_NAME` here `rishi`.

`-g users`: This option specifies the **primary group** for the new user. In this case, the primary group is `users`. This means that the new user will belong to the `users` group by default.

*   In Linux, every user is associated with a primary group. This primary group serves as the default group for the user when they create files or perform actions that require group permissions.
    

`-G wheel,storage,power,audio,video`: This option specifies **additional groups** that the new user will belong to. Wheel group typically allows users to execute commands with elevated privileges using `sudo`. Others are pretty obvious.

`-s /bin/bash`: This option sets the **default shell** for the new user. In this case, it specifies that the user will use `/bin/bash` as their shell, which is a common command-line interface in Linux.

*   We have three types of shells, Bash, Zsh, and Fish. Bash is the most popular one and stands for "Bourne Again SHell."
    

Now we need to set the password for the newly created User by using `passwd` followed by the name of the created User.

```powershell
passwd rishi
```

Now we might want the Users under the wheel group to use root privileges aka superuser.

```powershell
EDITOR=nano visudo
```

Specifying that the editor edits the `sudoers` file, with `visudo` the command. `visudo` is a special command used to safely edit the `/etc/sudoers` file, which controls user permissions for executing commands with superuser (root) privileges using `sudo`.

We might want to uncomment the following line at the end of the file:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723735524452/c729ec25-d771-465c-bd46-07be126c5e31.png align="center")

Then write the file with `ctrl+O` and exit with `ctrl+x`.

This can be verified by entering into the shell of the newly created user. To do this we need to type:

```powershell
su - rishi
```

*   `su` stands for "substitute user" or "switch user." It allows you to switch from your current user account to another user account in the system
    
*   By default, if you run `su` without any arguments, it tries to switch to the root user.
    
*   The hyphen (`-`) after `su` indicates that you want to start a new login shell as the specified user.
    

Now we shall update our local database, using `pacman`, after logging into the new user's shell.

```powershell
sudo pacman -Syu
```

Now after confirming that the new user has full access and updating the local database, we can continue and log out typing `exit`.

### Setting timezone and system language

**Setting timezone:**

Type the following and press Tab to print the list of all the timezones

```powershell
ln -sf /usr/share/zoneinfo
```

Find your timezone and replace `Asia/Kolkata` with your timezone

```powershell
ln -sf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime
```

To understand or break down the following command, we might want to know about inodes and soft/hard links.

**Inodes** (index nodes) are fundamental data structures in Linux file systems that store metadata about files and directories, except for the file name and actual data contents. Inodes keep track of all files and directories on a Linux system and store metadata such as file permissions, ownership, timestamps, and the locations of the file's data blocks on the disk.

To find we can provide a flag of `-i` in `ls` command

```powershell
ls -i
```

Now there are two different types of links,

*   **Soft/symbolic links (symlinks)**: Soft links are like pointers, which address to a original file and but softlinks have different inode as the original file, its like a shortcut, which means if the original file is deleted the softlinks will become usless.
    
*   **Hard links:** Hard links are like reference, they refer to the same file & they share the same inode number and occupy the same space on the disk. Though Hard links cannot span across different file systems or partitions.
    

Now that we have established the definitions of inodes and hard/soft links we can breakdown the following command.

`ln`: is the command used to create links between files and directories in Linux.

`-s`: The `-s` option tells `ln` to create a symbolic link.

`-f`: This option stands for "force." It tells `ln` to overwrite any existing links without prompting.

`/usr/share/zoneinfo/Asia/Kolkata`: This is obviously the path to the time zone information file for Asia/Kolkata.

`/etc/localtime`: is a special file that represents the system's current time zone setting.

Now we have established a symlink pointing to the corresponding time zone information file in the `zoneinfo` directory.

**Syncing system clock with hardware clock:**

```powershell
hwclock --systohc
```

*   `hwclock` is a command-line utility in Linux that is used to access and manage the hardware clock of the system.
    
*   The hardware clock is a battery-powered clock that keeps track of the time even when the computer is turned off.
    
*   The `--systohc` option stands for "system to hardware clock."
    
*   This option tells the `hwclock` command to set the hardware clock to the current time of the system clock.
    

**Specifying system locale:**

Now we might want to specify our locale by uncommenting the desired locale from `locale.gen` file which can be found under `/etc/locale.gen`

```powershell
nano /etc/locale.gen
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723742079607/22b779d7-87e0-4b9a-b791-7c5d23c13064.png align="center")

Write the file and exit nano text editor.

Now we need to generate the necessary locale files in the system, which are used by applications to support different languages and regional settings.

```powershell
locale-gen
```

At last we need to specify the `locale.conf` file located in `/etc/locale.conf`.

```powershell
nano /etc/locale.conf
```

type the following locale in the configuration file

```powershell
LANG=en_US.UTF-8
```

After generating locales, we can setup the hostname for the computer under `etc/hostname`. Then type the name of the hostname

```powershell
nano /etc/hostname
```

We have configured the system and now we can Install our choice of bootloader, here `GRUB` and other tools, to boot the system.

### Installing and configuring `GRUB`

```powershell
pacman -S grub efibootmgr dosfstools mtools
```

After downloading the tools, We will install `GRUB` in EFI partition as discussed earlier. To install boot, we will use `grub-install` utility.

```powershell
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
```

`--target=x86_64`: specifies the target platform for the GRUB installation. In this case, `x86_64-efi` indicates that GRUB will be installed for modern 64-bit UEFI systems.

`--efi-directory=/boot`: This option sets the directory where the UEFI System Partition (ESP) is mounted. Previously we mounted the ESP under `/boot`

`--bootloader-id=GRUB`: This option sets the name of the bootloader entry in the UEFI firmware. In this case, it's set to `GRUB`.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723744929439/0bd5e2e8-a949-4f2f-9002-fc194bf6ce31.png align="center")

Re/generate grub's configuration file to identify/update this linux kernel using `grub-mkconfig`.

```powershell
grub-mkconfig -o /boot/grub/grub.cfg
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723746224751/e338465f-8c02-41ab-b1f2-f81184918fcd.png align="center")

Now we can also enable Bluetooth and network services.

To enable those we might want to know about `systemd`.

systemd is a system and service manager for Linux operating systems, designed to streamline the boot process and manage system services. systemd is the first process started by the Linux kernel during boot (known as PID 1). It is responsible for initializing the system and managing user space services.

(One of the key features of systemd is its ability to start services in parallel, significantly speeding up the boot process. It uses dependency-based service control logic to ensure that services are started in the correct order.)

And `systemctl` is a command-line tool used to control the systemd system and service manager in Linux. It allows administrators to manage services, system state, and other systemd components. To enable the services mentioned before, we might want to use `systemctl`

```powershell
systemctl enable bluetooth
```

```powershell
systemctl enable NetworkManager
```

Now we can safely unmount the partitons and shutdown the system so that id can safely write all the data.

To unmount all the partitions after exiting from the chroot:

```powershell
umount -lR /mnt
```

`-l` **(lazy unmount)**: The `-l` option tells `umount` to perform a lazy unmount. This means that the file system will be detached from the mount point immediately, but the actual unmount operation will be delayed until the file system is no longer busy.

`-R` **(recursive)**: The `-R` option makes `umount` unmount a directory and all its subdirectories recursively. This is useful when you want to unmount an entire directory tree that contains multiple mounted file systems.

Shutdown by typing `shutdown now`, After booting again we will boot into grub and then we can boot into arch and login as a user.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1723746484824/b3d578c9-b0ce-4eba-a7c8-da947eb8e68c.png align="center")

After logging in, it's time to install the GUI.

### Installing the GUI

update the pacman database by typing `sudo pacman -Syu` after connecting via ethernet.

We will install KDE plasma which is the most user friendly desktop environment:

```powershell
sudo pacman -S xorg sddm plasma-meta
```

This will install display managers and KDE plasma environment.

Some recommended supporting packages can also be installed.

```powershell
plasma-wayland-session firefox dolphin konsole kwrite libreoffice-fresh clang cmake make gcc cargo noto-fonts-emoji ttf-dejavu ttf-font-awesome
```

Now we can just use `systemctl` to enable and start `sddm`

```powershell
sudo systemctl enable sddm
sudo systemctl start sddm
```

Now you will finally boot into KDE plasma.

Thank you for taking the time to read this comprehensive guide on Arch Linux! In this guide, I have aimed to explain every small detail and clarify all the terms in layman’s language, making it accessible for both newcomers and seasoned users alike. My goal was to ensure that you feel confident navigating the installation and configuration of Arch Linux, regardless of your prior experience.

If you found this guide helpful, You can connect me on the following platforms:

*   [**X (formerly Twitter)**](http://x.com/rishi2220)
    
*   [**LinkedIn**](https://www.linkedin.com/in/rishi-ahuja-b1a224310/)