---
title: "Your Hardest \"Hello World!\": Text Rasterization #1"
brief: "Deep technical blog exploring TTF file format and text rendering fundamentals."
dateAdded: 2025-06-14T00:00:00.000Z
hashnodeUrl: "https://rishi2220.hashnode.dev/your-hardest-hello-world-text-rasterization-1"
readTimeInMinutes: 36
author: "Rishi Ahuja"
---
<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">This ain’t a 2-minute read. It's long, but every section builds toward understanding something meaningful</div>
</div>

# Understanding Bitmaps

A **bitmap** is the most straightforward way to represent an image digitally. Think of it as a direct map of pixels. For every pixel on the screen, a bitmap stores specific information about its color. It's like having a detailed instruction manual for every pixel on our screen, telling it exactly what color to be. The term "bitmap" literally means "a map of bits," referring to the individual pieces of data that define each pixel.

The simplest form of a bitmap is a **monochrome bitmap**, which only uses two colors, typically black and white. In this case, each pixel can be represented by a single "bit" of data: a `0` for one color (e.g., black or "off") and a `1` for the other color (e.g., white or "on"). It's a binary system: either the pixel is lit, or it's not.

Consider how the letter 'A' might be stored as an 8x8 bitmap:

```cpp
/* A */
        {
            0b00111000,  // ░░███░░░
            0b01101100,  // ░██░██░░
            0b11000110,  // ██░░░██░
            0b11111110,  // ███████░
            0b11000110,  // ██░░░██░
            0b11000110,  // ██░░░██░
            0b00000000,  // ░░░░░░░░
            0b00000000   // ░░░░░░░░
        },
```

There are a lot of issues with Bitmaps, though.

*   It’s too pixelated 💁
    
*   Imagine our 8x8 letter 'A'. What happens if you try to make it twice as big, say 16x16 pixels. With a bitmap, we need to stretch the pixels by filling them at double scale.
    
*   High-quality, detailed bitmap images (like uncompressed photos) can be very large, consuming a lot of storage space and bandwidth. This makes them inefficient for complex graphics or for transmitting over the internet without compression.
    
*   When one edits a bitmap image, they’re essentially changing individual pixel colors. You can't easily select a "line" and make it thicker or thinner because the concept of a "line" as a single entity doesn't exist; it's just a collection of colored pixels hence reshaping elements or performing complex transformations (like rotating or skewing) on bitmap images can be difficult and often leads to quality degradation.
    

# Vector Fonts

**Vector graphics** are fundamentally different and a far more powerful way to represent images. Instead of describing an image pixel-by-pixel, vector graphics describe it using **mathematical equations**.

Imagine you want to draw a perfect circle. With a bitmap, you'd painstakingly color in all the individual pixels that make up the circle's shape. If you want a bigger circle, you'd need a completely new, larger set of pixels.

With vector graphics, you don't store pixels. Instead, you store instructions like: "Draw a circle with a center at (X, Y) and a radius of Z." Or for a line: "Draw a straight line from point (A, B) to point (C, D)." For more complex shapes, like letters in a font, vector graphics use things like **Bezier curves**, which are defined by a few control points, allowing for incredibly smooth and complex contours with very little data.

Since the image is defined by mathematical formulas, the computer can recalculate and redraw the image perfectly at *any* size or resolution.

For complex drawings or text, vector files are often much smaller than their bitmap counterparts. Why? Because you're storing equations, not millions of pixel values.

# TrueType Fonts (TTF)

TrueType Fonts were developed by Apple and Microsoft in the late 1980s as a competitor to Adobe's PostScript fonts. Their primary innovation, and why they became so popular, lies in their ability to provide high-quality, scalable text on a wide range of devices and resolutions.

## Endianness

Computers store multi-byte values (like integers, which are more than 1 byte) in memory. **Endianness** refers to the order in which these bytes are stored.

*   **Big-Endian:** The most significant byte (MSB, the "biggest" part of the number) is stored at the lowest memory address. It's like writing numbers, how we normally do: `123` (the `1` is the most significant digit, at the start. When you read from left to right, you read the most significant part first.
    
*   **Little-Endian:** The least significant byte (LSB, the "smallest" part of the number) is stored at the lowest memory address. It's like writing numbers "backwards" from our usual perspective: `321` if you were to read the bytes from left to right in memory. When you read from left to right, you read the least significant part first.
    

The TrueType Font specification (the "decoder ring" for TTF files) dictates that all multi-byte numbers within the file are stored in **Big-Endian format**. This is a standard convention for many network protocols and file formats.

However, most modern consumer computers (like the one you're probably using right now) are **Little-Endian**. This difference creates a problem:

If you read a multi-byte number from a Big-Endian file directly into a Little-Endian computer's memory, your computer will interpret the bytes in the wrong order, giving you a completely different (and wrong) number!

Let's say the font file stores the number `17`.

*   In decimal: `17`
    
*   In hexadecimal: `0x0011` (where `0x00` is the Most Significant Byte, and `0x11` is the Least Significant Byte).
    

**How it's stored in a Big-Endian file:** The file contains the bytes in this order: `00 11` (MSB first, then LSB).

**How a Little-Endian computer reads it byte by byte and tries to reconstruct it:**

1.  Reads the first byte: `00`
    
2.  Reads the second byte: `11`
    

Because it's Little-Endian, when it reconstructs the 16-bit number, it assumes the first byte it read (`00`) is the **LSB** and the second byte it read (`11`) is the **MSB**. So, it incorrectly reconstructs the number as `0x1100` (which is `4352` in decimal).

The computer interpreted `0x1100` when the file intended `0x0011` getting `4352` instead of `17`.

Hence we need to create some helper functions for conversion.

```cpp
bool TTFReader::isLittleEndian() {
    uint16_t test = 1;
    return reinterpret_cast<uint8_t*>(&test)[0] == 1;
}

uint16_t TTFReader::swapUint16(uint16_t val) {
    return (val << 8) | (val >> 8);
}

uint32_t TTFReader::swapUint32(uint32_t val) {
    return (val << 24) | ((val & 0x0000FF00) << 8) | 
           ((val & 0x00FF0000) >> 8) | (val >> 24);
}
```

## Reading one TTF file

Let’s start by reading and printing the first 100 bytes of our ttf file, here I’ve chose JetBrains Mono.  
Here is some basic C++ code to do the same.

```cpp
    const char* filename = "JetBrainsMono-Bold.ttf";
    std::ifstream file(filename, std::ios::binary);
    
    if (!file.is_open()) {
        std::cout << "Failed to open font file: " << filename << std::endl;
        return 1;
    }

    std::cout << "Reading first 100 bytes of '" << filename << "':" << std::endl;
    for (int i = 0; i < 100 && file.good(); ++i) {
        uint8_t byte;
        file.read(reinterpret_cast<char*>(&byte), sizeof(byte));
        std::cout << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(byte) << " ";
        if ((i + 1) % 16 == 0) {
            std::cout << std::endl;
        }
    }
    std::cout << std::dec << std::endl;
```

A standard for loop to read each byte and print it on the console. Here is the output of the file.

```plaintext
Reading first 100 bytes of 'JetBrainsMono-Bold.ttf':
00 01 00 00 00 11 01 00 00 04 00 10 47 44 45 46 
14 dc 05 92 00 03 b4 fc 00 00 02 2a 47 50 4f 53 
a5 be 09 a4 00 03 b7 28 00 00 24 08 47 53 55 42 
28 db c9 88 00 03 db 30 00 00 62 14 4f 53 2f 32 
13 61 0b 64 00 00 01 98 00 00 00 60 63 6d 61 70 
5a 24 58 da 00 00 1d 34 00 00 42 6a 63 76 74 20 
28 58 10 15
```

There are clear instructions to read this hex dump, let’s start by reading the first 12 bytes.

### TTF Header Structure

The first part of any TrueType Font file is the **Offset Table,** also called the font directory, often referred to as the **TTF Header**. It's a small but vital block of data that acts as the entry point for parsing the rest of the font.

1.  **Scalar Type** (4 bytes - `uint32_t`):
    

*   This field is a signature that tells you what kind of outlines the font contains. It's essentially a version number or a format identifier for the font data. It indicates which "font scaler" (the software component responsible for rendering the glyphs) should be used.
    
    *   `0x00010000`: This is the most common `scalerType` for TrueType fonts. It literally means version 1.0 of the TrueType specification.
        
    *   `0x74727565` (which spells `trueno` when interpreted as ASCII characters): This value is also used for TrueType fonts. It's often found in older TrueType fonts or fonts converted from other formats.
        
    *   Other values might indicate different font technologies, like `0x4F54544F` (`OTTO`) for OpenType fonts with CFF (Compact Font Format) outlines.
        
*   By reading this `scalerType` first, a program knows how to correctly interpret the rest of the font file. If it expects a TrueType font but reads a different `scalerType`, it might not be able to parse the file correctly.
    
*   The very first four bytes are `00 01 00 00`. If we read these as Big-Endian (as per TTF spec), they indeed form `0x00010000`, confirming it's a standard TrueType font. This `scalerType` tells our `TTFReader` that it's dealing with the expected TrueType outline format.
    

2.  **Num Tables** (2 bytes - `uint16_t`):
    
    *   This tells us exactly how many tables (like `glyf`, `head`, `cmap`, etc.) are present in this font file. This is crucial because it dictates how many `TableEntry` records follow the header.
        
    *   The bytes immediately following `scalerType` are `00 11`. As discussed under Endianness, when correctly byte-swapped (if on a Little-Endian system) from `0x0011` to `0x1100` for a Little-Endian computer, or directly read as Big-Endian, this value means `17` in decimal. So, this font has 17 different data tables!
        
    *   We’ll look into these tables and how to interpret them further.
        
3.  **Search Range** (2 bytes - `uint16_t`):
    
    *   This is a value used in a binary search algorithm to quickly locate table entries. It's calculated as `(maximum power of 2 <= numTables) * 16`.
        
    *   From our raw output the bytes are `01 00`. Interpreted correctly (Big-Endian `0x0100`), this is `256` in decimal. For `numTables = 17`, the maximum power of 2 less than or equal to 17 is 16. `16 * 16 = 256`, which matches, **but right now, it can be skipped**!
        
4.  **Entry Selector** (2 bytes - `uint16_t`):
    
    *   This is `log2(maximum power of 2 <= numTables)`. In our case, `log2(16) = 4`.
        
    *   The bytes are `00 04`. Interpreted correctly (Big-Endian `0x0004`), this is `4` in decimal. This also matches.
        
5.  **Range Shift** (2 bytes - `uint16_t`):
    
    *   This is `(numTables - (maximum power of 2 <= numTables)) * 16`. In our case, `(17 - 16) * 16 = 1 * 16 = 16`.
        
    *   The bytes are `00 10`. Interpreted correctly (Big-Endian `0x0010`), this is `16` in decimal.
        

**A quick summary:**

| Offset | Size | Name | Description |
| --- | --- | --- | --- |
| 0 | 4 | scalerType | Font type identifier |
| 4 | 2 | numTables | Number of tables in font |
| 6 | 2 | searchRange | (numTables × 16) rounded to power of 2 |
| 8 | 2 | entrySelector | log2(searchRange ÷ 16) |
| 10 | 2 | rangeShift | (numTables × 16) - searchRange |

The most useful stuff we found out was the number of tables, which in this case were 17.

```cpp
struct TTFHeader {
    uint32_t scalerType;    // 4 bytes
    uint16_t numTables;     // 2 bytes
    uint16_t searchRange;   // 2 bytes
    uint16_t entrySelector; // 2 bytes
    uint16_t rangeShift;    // 2 bytes
};
```

### The Table Directory

Now that we've read the initial 12 bytes of the Offset Subtable, our "reading pointer" is at **byte 12**. This is where the actual Table Directory begins. Since `numTables` is 17, we expect 17 entries, each 16 bytes long.

Each Table Entry contains 4 things.

| Field | Size (bytes) |
| --- | --- |
| tag | 4 |
| checksum | 4 |
| offset | 4 |
| length | 4 |

Let's look at the raw hexadecimal output again, starting from the 13th byte.

```plaintext
... (first 12 bytes are the header) ...
12th byte: 10
13th byte onwards:
47 44 45 46  // tag
14 dc 05 92  // checksum
00 03 b4 fc  // offset
00 00 02 2a  // length
```

Let's interpret the **first** `TableEntry` from this raw data:

*   `tag` (4 bytes): `47 44 45 46`
    
    *   Interpreted as ASCII characters, `47` is 'G', `44` is 'D', `45` is 'E', `46` is 'F'. So, this tag is `GDEF`.
        
*   `checksum` (4 bytes - `uint32_t`): `14 dc 05 92`
    
    *   Let’s discuss this in a minute.
        
    *   Interpreted as Big-Endian `0x14DC0592`.
        
*   `offset` (4 bytes - `uint32_t`): `00 03 b4 fc`
    
    *   This is one of the most critical fields. It tells us exactly **where in the font file** the `GDEF` table actually begins, measured in bytes from the very start of the file.
        
    *   Interpreted as Big-Endian `0x0003B4FC`. This means the `GDEF` table starts at byte position `242940` within the file.
        
*   `length` (4 bytes - `uint32_t`): `00 00 02 2a`
    
    *   This tells us the **size of the** `GDEF` table in bytes.
        
    *   Interpreted as Big-Endian `0x0000022A`. This means the `GDEF` table is `554` bytes long.
        

**Checksum:**

*   When the font file is created (or a specific table within it is generated), a specific algorithm is used to run through all the bytes of that table's data. This algorithm performs a series of mathematical operations to produce a single, unique number, the **checksum**. This checksum is then stored right there in the `TableEntry` alongside the `offset` and `length`. It's like the font creator is saying, Based on these bytes, this is the fingerprint they *should* have.
    
*   When our program wants to be absolutely sure that a particular table (say, the `'GDEF'` table) hasn't been corrupted or altered since it was created, it can do the following:
    
    *   It reads the `offset` and `length` of the `'GDEF'` table from its `TableEntry`.
        
    *   It then jumps to that `offset` in the file and reads *all* the bytes of the `GDEF` table data (up to its `length`).
        
    *   It then runs the exact same checksum algorithm over these bytes that it just read.
        
    *   Finally, it compares the checksum it just calculated to the `checksum` value that was stored in the `TableEntry` for the `'GDEF'` table.
        
*   umm, more or less, for now this value can be ignored, it’s just a security check.
    

Let’s create a simple script to read these bytes for us and let’s print the output of all the 17 table entires.

```cpp
struct TableEntry {
    char tag[5];       
    uint32_t checksum;
    uint32_t offset;
    uint32_t length;
};
```

Reading a single table

```cpp
bool TTFReader::readTableEntry(TableEntry& entry) {
    if (!file.good()) return false;
    
    file.read(entry.tag, 4);
    entry.tag[4] = '\0';  // Null terminate
    
    file.read(reinterpret_cast<char*>(&entry.checksum), 4);
    file.read(reinterpret_cast<char*>(&entry.offset), 4);
    file.read(reinterpret_cast<char*>(&entry.length), 4);
    
    if (littleEndian) {
        entry.checksum = swapUint32(entry.checksum);
        entry.offset = swapUint32(entry.offset);
        entry.length = swapUint32(entry.length);
    }
    
    return file.good();
}

void TTFReader::printTableEntry(const TableEntry& entry) {
    std::cout << "  Table: " << entry.tag 
              << ", Offset: " << entry.offset 
              << ", Length: " << entry.length << std::endl;
}
```

And iterating over all 17 tables.

```cpp
std::cout << "\nTables:" << std::endl;
for (int i = 0; i < header.numTables; i++) {
    TableEntry entry;
    if (reader.readTableEntry(entry)) {
        reader.printTableEntry(entry);
    }
}
```

This will give us all the tables in the font file. Here is what the output looks like.

```plaintext
Tables:
  Table: GSUB, Offset: 880, Length: 680
  Table: HVAR, Offset: 416, Length: 47
  Table: OS/2, Offset: 520, Length: 96
  Table: STAT, Offset: 724, Length: 156
  Table: avar, Offset: 316, Length: 30
  Table: cmap, Offset: 3136, Length: 1888
  Table: fvar, Offset: 616, Length: 106
  Table: gasp, Offset: 308, Length: 8
  Table: glyf, Offset: 17660, Length: 70216
  Table: gvar, Offset: 87876, Length: 93512
  Table: head, Offset: 464, Length: 54
  Table: hhea, Offset: 380, Length: 36
  Table: hmtx, Offset: 5024, Length: 2000
  Table: loca, Offset: 7024, Length: 2000
  Table: maxp, Offset: 348, Length: 32
  Table: name, Offset: 1560, Length: 1574
  Table: post, Offset: 9024, Length: 8636
  Table: prep, Offset: 300, Length: 7
```

Most of the tables are not required as of now, the most important table that we need to jump on right now is the `glyf` table.

## Glyf Table

Let’s move to the glyph table based on the offset we read in the list of tables. In the case of `glyf` the table, the offset is 17600. Let’s examine this offset and hex dump of this table to see what we see.

A simple function to find our table from the header.

```cpp
bool TTFReader::findTable(const std::string& tableName, TableEntry& entry) {
    // Reset to start of file and skip header
    file.seekg(12, std::ios::beg);
    
    TTFHeader header;
    file.seekg(0, std::ios::beg);
    if (!readHeader(header)) return false;
    
    // Search through table entries
    for (int i = 0; i < header.numTables; i++) {
        TableEntry tempEntry;
        if (readTableEntry(tempEntry)) {
            if (std::string(tempEntry.tag) == tableName) {
                entry = tempEntry;
                return true;
            }
        }
    }
    return false;
}
```

Now let’s seek to the table offset and print the hex dump.

```cpp
bool TTFReader::seekToTable(const std::string& tableName) {
    TableEntry entry;
    if (findTable(tableName, entry)) {
        file.seekg(entry.offset, std::ios::beg);
        return true;
    }
    return false;
}
```

Here is the hex dump:

```plaintext
00 03 00 5a 00 00 01 fe 02 da 00 03 00 06 00 09 (Bytes 0-15 relative to glyf table start)
00 31 40 2e 09 04 02 03 02 01 4c 00 00 00 02 03 (Bytes 16-31)
00 02 67 00 03 01 01 03 57 00 03 03 01 5f 04 01 (Bytes 32-47)
01 03 01 4f 00 00 08 07 06 05 00 03 00 03 11 05 (Bytes 48-63)
06 17 2b 33 11 21 11 25 01 21 13 21 11 5a 01 a4 (Bytes 64-79)
fe 8e 01 2c fe d4 14 01 2c 02 da fd 26 6d 02 3b (Bytes 80-95)
fd 8a 02 3b 00 02 00 23 00 00 02 35 02 da 00 07 (Bytes 96-111)
00 10 00 2c 40 29 0d 01 04 00 01 4c 00 04 00 02 (Bytes 112-127)
01 04 02 68 00 00 00 38 4d 05 03 02 01 01 39 01 (Bytes 128-143)
4e 00 00 09 08 00 07 00 07 11 11 11 06 09 19 2b (Bytes 144-159)
33 13 33 13 23 27 23 07 13 33 27 26 26 27 06 06 (Bytes 160-175)
07 23 b8 a1 b9 80 28 c2 28 3f 94 2c 0b 10 03 03 (Bytes 176-191)
10 0b 02 da fd 26 b1 b1 (Bytes 192-199)
```

### Inside a Simple Glyph

A typical glyph (what TrueType calls a "simple glyph") consists of two main parts: a `GlyphHeader` and the actual point data that defines its contours.

### Glyph Header

Every simple glyph starts with a `GlyphHeader`, defined as:

```cpp
struct GlyphHeader {
    int16_t numberOfContours; // 2 bytes
    int16_t xMin, yMin, xMax, yMax; // 2 bytes each, for a total of 8 bytes
};
```

**Number of Contours:**

*   If it's **positive**, it indicates the number of simple contours (closed shapes) that make up this glyph. For example, the letter 'O' might have two contours (an outer circle and an inner circle).
    
*   If it's **negative** (specifically -1), it indicates that this is a "compound glyph" (a glyph made up of other simpler glyphs, like an accented character that's composed of a base letter and an accent mark).
    
*   In our data, the value is `0x0003` (after byte swap on Little-Endian) aka Decimal Value of 3. We’ll see why the first character has 3 contours later.
    
*   We’ll worry about the compound glyphs later.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1749643315429/522b2a1f-bce7-41e0-9914-45c0fa644d31.png align="center")

**Bounding Box:**

`xMin`, `yMin`, `xMax`, `yMax` **(Bytes 2-9, int16 each)** define the **bounding box** of the glyph. They represent the minimum X, minimum Y, maximum X, and maximum Y coordinates that encompass all the points of the glyph's outline. These values are in "font units" (a coordinate system specific to the font, defined in the `'head'` table). This bounding box is useful for layout and rendering.

Here is our actual data:

*   `xMin` (Bytes 2-3): `00 5A`
    
    *   **Interpreted:** `0x005A`
        
    *   **Decimal Value:** 90
        
*   `yMin` (Bytes 4-5): `00 00`
    
    *   **Interpreted:** `0x0000`
        
    *   **Decimal Value:** 0
        
*   `xMax` (Bytes 6-7): `01 FE`
    
    *   **Interpreted:** `0x01FE`
        
    *   **Decimal Value:** 510
        
*   `yMax` (Bytes 8-9): `02 DA`
    
    *   **Interpreted:** `0x02DA`
        
    *   **Decimal Value:** 730
        

We have read 10 bytes (2 for contours + 8 for bounding box). So, the next data starts at byte 10 (relative to glyf start).

### Simple Glyph

After the `GlyphHeader`, the specific point data for a simple glyph follows. Our `SimpleGlyph` struct captures this:

```cpp
struct SimpleGlyph {
    GlyphHeader header;
    std::vector<uint16_t> endPtsOfContours; // Marks the end of each contour
    std::vector<Point> points; // Contains the actual X, Y coordinates and on/off-curve flag
};
```

After 10 bytes, the next bytes represent `endPtsOfContours` (`uint16` array)

**End Point of Contours:**

This is a list of indices. Each index points to the *last point* in a particular contour. For example, if `endPtsOfContours` contains `[4, 6]`, it means the first contour uses points 0 through 4, and the second contour uses points 5 through 7. This allows the renderer to draw each closed shape correctly.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1749644286756/abf4d3e3-0b1b-4676-bff9-8f89bfdabb67.png align="center")

The Raw data of our hex dump interprets as:

*   **Contour 0 end index (Bytes 10-11):**
    
    *   **Interpreted:** `0x0003`
        
    *   **Decimal Value:** 3
        
*   **Contour 1 end index (Bytes 12-13):** `00 06`
    
    *   **Interpreted:** `0x0006`
        
    *   **Decimal Value:** 6
        
*   **Contour 2 end index (Bytes 14-15):** `00 09`
    
    *   **Interpreted:** `0x0009`
        
    *   **Decimal Value:** 9
        
*   **Meaning:**
    
    *   The first contour uses points from index 0 up to and including index 3.
        
    *   The second contour uses points from index 4 up to and including index 6.
        
    *   The third contour uses points from index 7 up to and including index 9.
        
    *   This tells us there are a total of `9 + 1 = 10` points in this glyph (`endPtsOfContours[last_contour_index] + 1`).
        

We have read `10 + 6 = 16` bytes. So, the next data starts at byte 16.

Next 2 bytes tell us the `instructionLength`.

These `instructions` (also known as "hints") are a sequence of bytecode that the TrueType font scaler uses to subtly adjust the glyph's points to ensure optimal rendering, especially at small sizes or low resolutions. They help characters look crisp and aligned to the pixel grid. While crucial for high-quality rendering, parsing these instructions is a complex topic on its own and is generally skipped by simpler font parsers like ours.

Instruction length data:

*   **Interpreted:** `0x0031`
    
*   **Decimal Value:** 49
    
*   **Meaning:** There are 49 bytes of instruction data for this glyph.
    

Instructions (hinting):

```plaintext
40 2e 09 04 02 03 02 01 4c 00 00 00 02 03
00 02 67 00 03 01 01 03 57 00 03 03 01 5f
04 01 01 03 01 4f 00 00 08 07 06 05 00 03
00 03 11 05 06 17 2b
```

We have read 18 + 49 = 67 bytes. So, the next data starts at byte 67.

Next are Flags.

`flags` **(Variable Bytes) and Point Data (**`xCoordinates`**,** `yCoordinates`**):**

Finally, after the instructions, comes the actual **point data** that defines the glyph's shape. This is read as a series of `flags` followed by the X and Y coordinates. The number of points is derived from the last value in `endPtsOfContours` (e.g., if the last `endPtsOfContours` is 10, there are 11 points in total, indexed 0 to 10).

Flags are used for efficiency and compression.

Font files can contain thousands of glyphs, each with many points. Storing all information explicitly would make files enormous. Flags allow for:

*   **Variable-sized coordinates:** Instead of always using 2 bytes for an X coordinate (e.g., if it's small, like 0 or 1), you can use just 1 byte. This saves a lot of space.
    
*   **Skipping zero offsets:** If an X coordinate is the same as the previous one (meaning the offset is 0), the flag can tell you to simply skip reading any bytes for that coordinate, saving even more space.
    
*   **Repeating flags:** If many consecutive points have the exact same properties, you don't need to store the flag byte for each one. You store it once, plus a count for how many times it repeats.
    

### Understanding Flags

Each bit can be checked by [simple bit masking](https://codeforces.com/blog/entry/18169).

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1749656118459/6ee42165-7587-45f3-9dc3-3717ef15c4d8.png align="center")

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">This might sound a little finicky right now, it will be clear when We’ll see an example</div>
</div>

*   **Bit 0:** `ON_CURVE_POINT`
    
    *   We’ll come to it when we’ll talk about bezier curves.
        
    *   `1`: The point lies directly on the glyph's outline (an anchor point for curves or corners).
        
    *   `0`: The point is an off-curve control point, used to shape Bézier curves.
        
*   **Bit 1:** `X_SHORT_VECTOR`
    
    *   `1`: The X-coordinate offset for this point is stored as a signed 1-byte value (`int8_t`).
        
    *   `0`: The X-coordinate offset is either a signed 2-byte value (`int16_t`) or implicitly zero.
        
*   **Bit 2:** `Y_SHORT_VECTOR`
    
    *   `1`: The Y-coordinate offset for this point is stored as a signed 1-byte value (`int8_t`).
        
    *   `0`: The Y-coordinate offset is either a signed 2-byte value (`int16_t`) or implicitly zero.
        
*   **Bit 3:** `REPEAT_FLAG`
    
    *   `1`: The current flag byte is repeated for a subsequent number of points. The byte immediately following this flag will specify the count of additional points to which this flag applies.
        
    *   `0`: The flag applies only to the current point.
        
*   **Bit 4:** `X_IS_SAME_OR_POSITIVE_X_SHORT_VECTOR`
    
    *   **If** `X_SHORT_VECTOR` (Bit 1) is `1`:
        
        *   `1`: The 1-byte X-coordinate offset is positive.
            
        *   `0`: The 1-byte X-coordinate offset is negative.
            
    *   **If** `X_SHORT_VECTOR` (Bit 1) is `0`:
        
        *   `1`: The X-coordinate offset is zero (no bytes are read for X).
            
        *   `0`: The X-coordinate offset is a signed 2-byte value (`int16_t`).
            
*   **Bit 5:** `Y_IS_SAME_OR_POSITIVE_Y_SHORT_VECTOR`
    
    *   **If** `Y_SHORT_VECTOR` (Bit 2) is `1`:
        
        *   `1`: The 1-byte Y-coordinate offset is positive.
            
        *   `0`: The 1-byte Y-coordinate offset is negative.
            
    *   **If** `Y_SHORT_VECTOR` (Bit 2) is `0`:
        
        *   `1`: The Y-coordinate offset is zero (no bytes are read for Y).
            
        *   `0`: The Y-coordinate offset is a signed 2-byte value (`int16_t`).
            

Bits 6 and 7 are reserved and typically set to `0`.

Consider a flag byte with the hexadecimal value `0x33` (binary `00110011`) as in our hex dump. Applying the bitwise logic:

*   **Bit 0 (**`ON_CURVE_POINT`): Is `1`. The point is **on-curve**.
    
*   **Bit 3 (**`REPEAT_FLAG`): Is `1`. This flag **repeats** for a subsequent number of points (determined by the next byte in the stream).
    
*   **Bit 1 (**`X_SHORT_VECTOR`): Is `1`. The X-coordinate is a **1-byte offset**.
    
*   **Bit 4 (**`X_IS_SAME_OR_POSITIVE_X_SHORT_VECTOR`): Is `0`. Since Bit 1 is `1`, this means the 1-byte X-offset is **negative**.
    
*   **Bit 2 (**`Y_SHORT_VECTOR`): Is `1`. The Y-coordinate is a **1-byte offset**.
    
*   **Bit 5 (**`Y_IS_SAME_OR_POSITIVE_Y_SHORT_VECTOR`): Is `0`. Since Bit 2 is `1`, this means the 1-byte Y-offset is **negative**.
    

Therefore, a `0x33` flag signifies an on-curve point whose X and Y coordinates are stored as 1-byte negative differences relative to the previous point, and this flag pattern is to be repeated for a specified count of subsequent points.

## Glyph Summary

This was a lot of data. Let’s summarize it quickly

### Glyph Header Structure

Below is a summary of the glyph header and simple glyph data structure, formatted for clarity in a markdown blog.

### Glyph Header

| Offset | Size | Description |
| --- | --- | --- |
| 0 | 2 | numberOfContours (signed: >0 = simple, -1 = composite) |
| 2 | 2 | xMin (bounding box) |
| 4 | 2 | yMin |
| 6 | 2 | xMax |
| 8 | 2 | yMax |

### Simple Glyph Data

| Offset | Size | Description |
| --- | --- | --- |
| 10 | 2 × n | endPtsOfContours\[numberOfContours\] |
| ? | 2 | instructionLength |
| ? | variable | instructions\[instructionLength\] |
| ? | variable | flags and coordinates |

### Flag Byte Details

*   **Bit 0 (0x01):** ON\_CURVE\_POINT (1 = on curve, 0 = control point)
    
*   **Bit 1 (0x02):** X\_SHORT\_VECTOR (1 = x-coord is 8-bit, 0 = 16-bit)
    
*   **Bit 2 (0x04):** Y\_SHORT\_VECTOR (1 = y-coord is 8-bit, 0 = 16-bit)
    
*   **Bit 3 (0x08):** REPEAT\_FLAG (next byte tells how many times to repeat this flag)
    
*   **Bit 4 (0x10):** X\_SAME\_OR\_POSITIVE\_X\_SHORT\_VECTOR (sign/same flag for x)
    
*   **Bit 5 (0x20):** Y\_SAME\_OR\_POSITIVE\_Y\_SHORT\_VECTOR (sign/same flag for y)
    

### Raw Data Interpretation

Now we can write a simple script to seek the `glyf` table and then print the points of the glyph

```cpp
bool TTFReader::seekToTable(const std::string& tableName) {
    TableEntry entry;
    if (findTable(tableName, entry)) {
        file.seekg(entry.offset, std::ios::beg);
        return true;
    }
    return false;
}
```

The script to read the whole glyph is long, but simple to understand after the whole explanation.

```cpp
bool TTFReader::readSimpleGlyph(SimpleGlyph& glyph) {
    if(!readGlyphHeader(glyph.header)) return false;

    if (glyph.header.numberOfContours < 0) {
        std::cout << "Composite glyph - not implemented yet" << std::endl;
        return false;
    }

    glyph.endPtsOfContours.resize(glyph.header.numberOfContours);
    for (int i = 0; i < glyph.header.numberOfContours; i++) {
        uint16_t endPt;
        file.read(reinterpret_cast<char*>(&endPt), 2);
        if (littleEndian) endPt = swapUint16(endPt);
        glyph.endPtsOfContours[i] = endPt;
    }

    uint16_t numPoints = glyph.endPtsOfContours.back() + 1;

    uint16_t instructionLength;
    file.read(reinterpret_cast<char*>(&instructionLength), 2);
    if (littleEndian) instructionLength = swapUint16(instructionLength);
    file.seekg(instructionLength, std::ios::cur); // Skip instructions
    
    std::vector<uint8_t> flags;
    flags.reserve(numPoints);

    for (uint16_t i = 0; i < numPoints; ) {
        uint8_t flag;
        file.read(reinterpret_cast<char*>(&flag), 1);
        flags.push_back(flag);
        i++;
        
        // Handle repeat flag
        if (flag & 0x08) { // REPEAT_FLAG
            uint8_t repeatCount;
            file.read(reinterpret_cast<char*>(&repeatCount), 1);
            for (int j = 0; j < repeatCount && i < numPoints; j++, i++) {
                flags.push_back(flag);
            }
        }
    }

    glyph.points.resize(numPoints);
    int16_t currentX = 0, currentY = 0;

    for (uint16_t i = 0; i < numPoints; i++) {
        uint8_t flag = flags[i];
        glyph.points[i].onCurve = (flag & 0x01) != 0;  

        if (flag & 0x02) { // X_SHORT_VECTOR
            uint8_t deltaX;
            file.read(reinterpret_cast<char*>(&deltaX), 1);
            currentX += (flag & 0x10) ? deltaX : -deltaX;
        } else if (!(flag & 0x10)) { // X coordinate changed
            int16_t deltaX;
            file.read(reinterpret_cast<char*>(&deltaX), 2);
            if (littleEndian) deltaX = static_cast<int16_t>(swapUint16(deltaX));
            currentX += deltaX;
        }

        glyph.points[i].x = currentX;
    }

     for (uint16_t i = 0; i < numPoints; i++) {
        uint8_t flag = flags[i];
        
        if (flag & 0x04) { // Y_SHORT_VECTOR
            uint8_t deltaY;
            file.read(reinterpret_cast<char*>(&deltaY), 1);
            currentY += (flag & 0x20) ? deltaY : -deltaY;
        } else if (!(flag & 0x20)) { // Y coordinate changed
            int16_t deltaY;
            file.read(reinterpret_cast<char*>(&deltaY), 2);
            if (littleEndian) deltaY = static_cast<int16_t>(swapUint16(deltaY));
            currentY += deltaY;
        }
        glyph.points[i].y = currentY;
    }
    return true;
}
```

It is suggested to shift to a font like roboto mono because it is easy to understand and implement.

`RobotoMono-VariableFont_wght.ttf` - [link](https://fonts.google.com/specimen/Roboto+Mono)

Here is the output of the code.

```plaintext
Reading glyph 2 at offset 17660 (size: 56 bytes)
Glyph Info:
  Contours: 2
  Bounding box: (81, 0) to (1168, 1456)
  End points: 7 10 
  Points:
    0: (869, 377) ON
    1: (984, 0) ON
    2: (1168, 0) ON
    3: (706, 1456) ON
    4: (551, 1456) ON
    5: (81, 0) ON
    6: (266, 0) ON
    7: (383, 377) ON
    8: (433, 538) ON
    9: (628, 1170) ON
    10: (820, 538) ON
```

Now that we've successfully dissected the `glyf` table and extracted the raw point data for a glyph, the next logical step is to **visualize it**. Seeing these numerical coordinates translated into a shape is crucial for understanding. Instead of immediately diving into pixel-level rasterization, let's take a detour into **SVG (Scalable Vector Graphics)**.

#### Understanding SVG for Glyph Visualization

An SVG file is essentially an XML document. For our purposes, we'll use a few key SVG elements:

*   `<svg>`: The root element, defining the overall canvas size.
    
*   `<g>`: A group element, useful for applying transformations (like scaling and translation) to multiple elements at once.
    
*   `<circle>`: To draw our individual points, distinguishing between on-curve and off-curve points.
    
*   `<path>`: This is the most powerful element for drawing complex shapes, including Bézier curves.
    
*   `<text>`: To label points with their indices for easier debugging.
    

#### Adjusting Coordinates for SVG

TrueType font coordinates typically have (0,0) at the baseline of the font, with Y values increasing upwards. SVG, by default, has (0,0) at the top-left corner, with Y values increasing *downwards*. To correctly display our glyphs in SVG, we'll need to:

1.  **Translate:** Shift the glyph so its `xMin` and `yMin` are offset from the SVG origin, allowing for padding.
    
2.  **Flip Y-axis:** Multiply Y-coordinates by -1 and then translate them again to account for the SVG's inverted Y-axis.
    

Let’s make a small function to do the same.

```cpp
void TTFReader::exportGlyphSVG(const SimpleGlyph& glyph, const std::string& filename) {
    std::ofstream svg(filename);
    
    int width = glyph.header.xMax - glyph.header.xMin + 100;
    int height = glyph.header.yMax - glyph.header.yMin + 100;
    
    svg << "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    svg << "<svg width=\"" << width << "\" height=\"" << height << "\" xmlns=\"http://www.w3.org/2000/svg\">\n";
    svg << "<g transform=\"translate(50," << (height - 50) << ") scale(1,-1)\">\n";
    
    // Draw points
    for (size_t i = 0; i < glyph.points.size(); i++) {
        const auto& point = glyph.points[i];
        int x = point.x - glyph.header.xMin;
        int y = point.y - glyph.header.yMin;
        
        if (point.onCurve) {
            svg << "<circle cx=\"" << x << "\" cy=\"" << y << "\" r=\"3\" fill=\"red\"/>\n";
        } else {
            svg << "<circle cx=\"" << x << "\" cy=\"" << y << "\" r=\"2\" fill=\"blue\"/>\n";
        }
        
        svg << "<text x=\"" << (x + 5) << "\" y=\"" << (y + 5) << "\" font-size=\"8\" fill=\"white\" transform=\"scale(1,-1)\">" << i << "</text>\n";
    }
    
    size_t pointIndex = 0;
    for (size_t contour = 0; contour < glyph.endPtsOfContours.size(); contour++) {
        size_t startPt = pointIndex;
        size_t endPt = glyph.endPtsOfContours[contour];
        
        svg << "<polygon points=\"";
        while (pointIndex <= endPt) {
            const auto& point = glyph.points[pointIndex];
            int x = point.x - glyph.header.xMin;
            int y = point.y - glyph.header.yMin;
            svg << x << "," << y << " ";
            pointIndex++;
        }
        svg << "\" fill=\"none\" stroke=\"green\" stroke-width=\"1\"/>\n";
    }
    
    svg << "</g>\n</svg>\n";
    svg.close();
    
    std::cout << "SVG exported to: " << filename << std::endl;
}
```

After running this function, we’ll see the SVG output as:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg width="1187" height="1556" xmlns="http://www.w3.org/2000/svg">
<g transform="translate(50,1506) scale(1,-1)">
<circle cx="788" cy="377" r="3" fill="red"/>
<text x="793" y="382" font-size="8" fill="white" transform="scale(1,-1)">0</text>
<circle cx="903" cy="0" r="3" fill="red"/>
<text x="908" y="5" font-size="8" fill="white" transform="scale(1,-1)">1</text>
<circle cx="1087" cy="0" r="3" fill="red"/>
<text x="1092" y="5" font-size="8" fill="white" transform="scale(1,-1)">2</text>
<circle cx="625" cy="1456" r="3" fill="red"/>
<text x="630" y="1461" font-size="8" fill="white" transform="scale(1,-1)">3</text>
<circle cx="470" cy="1456" r="3" fill="red"/>
<text x="475" y="1461" font-size="8" fill="white" transform="scale(1,-1)">4</text>
<circle cx="0" cy="0" r="3" fill="red"/>
<text x="5" y="5" font-size="8" fill="white" transform="scale(1,-1)">5</text>
<circle cx="185" cy="0" r="3" fill="red"/>
<text x="190" y="5" font-size="8" fill="white" transform="scale(1,-1)">6</text>
<circle cx="302" cy="377" r="3" fill="red"/>
<text x="307" y="382" font-size="8" fill="white" transform="scale(1,-1)">7</text>
<circle cx="352" cy="538" r="3" fill="red"/>
<text x="357" y="543" font-size="8" fill="white" transform="scale(1,-1)">8</text>
<circle cx="547" cy="1170" r="3" fill="red"/>
<text x="552" y="1175" font-size="8" fill="white" transform="scale(1,-1)">9</text>
<circle cx="739" cy="538" r="3" fill="red"/>
<text x="744" y="543" font-size="8" fill="white" transform="scale(1,-1)">10</text>
<polygon points="788,377 903,0 1087,0 625,1456 470,1456 0,0 185,0 302,377 " fill="none" stroke="green" stroke-width="1"/>
<polygon points="352,538 547,1170 739,538 " fill="none" stroke="green" stroke-width="1"/>
</g>
</svg>
```

The output will look like this.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1749806682118/f32d182c-5536-4359-8470-4b6ef28c7e82.png align="center")

This looks so damn cool to me.

You might be tempted to think, Great! I can now just call `readSimpleGlyph` repeatedly to get all the characters..

However, there's a fundamental problem with that assumption: **glyphs within the** `glyf` table are not stored at fixed, contiguous sizes. Each glyph's data (header, end points, instructions, flags, and coordinates) has a variable length, depending on its complexity and the compression flags used.

This is precisely where the `loca` table (Index to Location Table) comes into play.

### Loca Table

*   The `glyf` table is a giant book containing descriptions of all the characters.
    
*   The `loca` table is the book's table of contents, telling you on which page each character's description begins.
    

When you call `TTFReader::seekToTable("glyf")` and then `reader.readSimpleGlyph(firstGlyph)`, the file pointer is positioned at the very beginning of the `glyf` table. `readSimpleGlyph` then reads the header, the contour end points, skips instructions, and reads the flags/coordinates for *whatever data is immediately present at that location*. Since glyphs have variable sizes, the file pointer will simply stop at the end of the *first* glyph's data.

If you were to call `reader.readSimpleGlyph(secondGlyph)` again *without moving the file pointer explicitly*, it would attempt to read from the *next byte after the first glyph*. This might work for some fonts if the second glyph immediately follows, but it's not a reliable way to access a *specific* glyph (like the glyph for 'B' or 'C') by its character code.

To solve the issue, we need to read `loca` table. `loca` table basically acts as a "table of contents" for the `glyf` table. Let’s see.

### `loca` Table Structure

The `loca` table is much simpler than `glyf`.

First, we need to find the **'head' table** because it contains metadata about the font, including how the 'loca' table is formatted.

```cpp
// Read indexToLocFormat (at offset 50 in head table)
file.seekg(headEntry.offset + 50, std::ios::beg);
int16_t indexToLocFormat;
file.read(reinterpret_cast<char*>(&indexToLocFormat), 2);
if (littleEndian) indexToLocFormat = static_cast<int16_t>(swapUint16(indexToLocFormat));
```

**What's happening:**

*   Jump to **byte 50** within the 'head' table
    
*   Read 2 bytes (the `indexToLocFormat` field)
    
*   Convert from big-endian if needed
    

**The 'head' table structure** (simplified):

```plaintext
Offset | Field
-------|------------------
0      | version
4      | fontRevision
...    | ...
50     | indexToLocFormat  ← We want this!
52     | glyphDataFormat
```

`indexToLocFormat` (from `head` table):

*   `0`: Short format. Each offset is a `uint16` (2 bytes) and represents `offset / 2`. The actual offset in `glyf` table is `value * 2`. This limits offsets to 65535 \* 2 = 131070 bytes, meaning `glyf` tables cannot be very large.
    
*   `1`: Long format. Each offset is a `uint32` (4 bytes) and represents the direct byte offset. This allows for much larger `glyf` tables.
    

```cpp
TableEntry locaEntry;
if (!findTable("loca", locaEntry)) {
    std::cout << "No 'loca' table found" << std::endl;
    return;
}
```

Find where the `loca` table is stored in the font file.

```cpp
// Calculate number of glyphs
size_t entrySize = isLongFormat ? 4 : 2;
size_t numEntries = locaEntry.length / entrySize;
size_t numGlyphs = numEntries - 1; // Last entry is end marker
```

The number of glyphs is **NOT** stored directly. We calculate it:

1.  Total bytes in `loca` table ÷ bytes per entry = number of entries
    
2.  Number of glyphs = entries - 1 (because the last entry is just an end marker)
    

**Example:**

*   `loca` table is 1000 bytes long
    
*   Long format (4 bytes per entry)
    
*   1000 ÷ 4 = 250 entries
    
*   250 - 1 = **249 glyphs** in the font
    

The next step is to read the `loca` table.

```cpp
file.seekg(locaEntry.offset, std::ios::beg);
std::cout << "\\\\nFirst 10 glyph locations:" << std::endl;

for (int i = 0; i < 10 && i < static_cast<int>(numEntries); i++) {
    uint32_t offset;

    if (isLongFormat) {
        file.read(reinterpret_cast<char*>(&offset), 4);
        if (littleEndian) offset = swapUint32(offset);
    } else {
        uint16_t shortOffset;
        file.read(reinterpret_cast<char*>(&shortOffset), 2);
        if (littleEndian) shortOffset = swapUint16(shortOffset);
        offset = shortOffset * 2; // Convert to actual offset
    }

    std::cout << "  Glyph " << i << ": starts at offset " << offset << std::endl;
}
```

Long Format (4 bytes):

```cpp
file.read(reinterpret_cast<char*>(&offset), 4);  // Read 4 bytes directly
```

Short Format (2 bytes):

```cpp
uint16_t shortOffset;
file.read(reinterpret_cast<char*>(&shortOffset), 2);  // Read 2 bytes
offset = shortOffset * 2;  // MULTIPLY BY 2!
```

In short format, the stored values are **half** the actual offset to save space. The real offset is always even, so they store `real_offset ÷ 2`.

**Example Output:**

You might see something like:

```plaintext
=== Understanding 'loca' table ===
Found 'head' table at offset: 316
Format: Long (4 bytes)
Found 'loca' table at offset: 123456, length: 2000
Number of glyphs: 499

First 10 glyph locations:
  Glyph 0: starts at offset 0
  Glyph 1: starts at offset 76
  Glyph 2: starts at offset 76      ← Same as glyph 1
  Glyph 3: starts at offset 234
  Glyph 4: starts at offset 456
  ...
```

Now we can make dedicated functions and then load and read the fonts by index.

```cpp
bool TTFReader::loadLocaTable() {
    // Step 1: Get format from head table
    TableEntry headEntry;
    if (!findTable("head", headEntry)) return false;
    
    file.seekg(headEntry.offset + 50, std::ios::beg);
    int16_t indexToLocFormat;
    file.read(reinterpret_cast<char*>(&indexToLocFormat), 2);
    if (littleEndian) indexToLocFormat = static_cast<int16_t>(swapUint16(indexToLocFormat));
    
    isLongFormat = (indexToLocFormat == 1);
    
    // Step 2: Load all glyph offsets
    TableEntry locaEntry;
    if (!findTable("loca", locaEntry)) return false;
    
    size_t entrySize = isLongFormat ? 4 : 2;
    size_t numEntries = locaEntry.length / entrySize;
    
    glyphOffsets.clear();
    glyphOffsets.reserve(numEntries);
    
    file.seekg(locaEntry.offset, std::ios::beg);
    
    for (size_t i = 0; i < numEntries; i++) {
        uint32_t offset;
        
        if (isLongFormat) {
            file.read(reinterpret_cast<char*>(&offset), 4);
            if (littleEndian) offset = swapUint32(offset);
        } else {
            uint16_t shortOffset;
            file.read(reinterpret_cast<char*>(&shortOffset), 2);
            if (littleEndian) shortOffset = swapUint16(shortOffset);
            offset = shortOffset * 2;
        }
        
        glyphOffsets.push_back(offset);
    }
    
    std::cout << "Loaded " << (numEntries - 1) << " glyph locations" << std::endl;
    return true;
}
```

Function to read a glyph by index.

```cpp
bool TTFReader::readGlyphByIndex(int glyphIndex, SimpleGlyph& glyph) {
    if (glyphOffsets.empty()) {
        if (!loadLocaTable()) return false;
    }

    if (glyphIndex < 0 || glyphIndex >= static_cast<int>(glyphOffsets.size() - 1)) {
        std::cout << "Glyph index " << glyphIndex << " out of range" << std::endl;
        return false;
    }
    
    uint32_t glyphOffset = glyphOffsets[glyphIndex];
    uint32_t nextGlyphOffset = glyphOffsets[glyphIndex + 1];
    
    if (glyphOffset == nextGlyphOffset) {
        std::cout << "Glyph " << glyphIndex << " is empty (no outline data)" << std::endl;
        return false;
    }
    
    TableEntry glyfEntry;
    if (!findTable("glyf", glyfEntry)) return false;
    
    file.seekg(glyfEntry.offset + glyphOffset, std::ios::beg);
    
    std::cout << "Reading glyph " << glyphIndex << " at offset " << (glyfEntry.offset + glyphOffset) 
              << " (size: " << (nextGlyphOffset - glyphOffset) << " bytes)" << std::endl;
    
    return readSimpleGlyph(glyph);
}
```

And now we can see multiple characters based on an index value.

Here is Index 17 for instance:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1749807918317/b59c3732-f54f-48a9-8d80-2013acdd3194.png align="center")

Index 3:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1749807908661/65790450-bc9e-4b9f-af93-b11b82f23747.png align="center")

Tell me this stuff ain’t cool?  
Right now, everything is a little blocky; we expect something which is kinda smooth, which can be discussed in another blog.

Just to let you know, we’ve just scratched the surface and still never “Rasterized” text. We’ve just learned to interpret basic data. But it was cool. Just showing what our next step is.

We need “B” to look something like that.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1749808059514/f29024df-2329-4d7e-8aa8-2f3b3d0edf06.png align="center")

This shit was long! but undeniably rewarding. We've just peeled back a layer of complexity many people never even knew existed in their everyday digital text. Pretty cool, right? We take text for granted.

Stay tuned for the next parts, where we'll delve into the magic of Bézier curves and the intricate process of font rasterization, finally transforming these mathematical outlines into perfectly rendered pixels on your screen.

Here is the github repo to explore the ttf reader - [link](https://github.com/rishiahuja/text-rasterization).

Feel free to connect with me on my social media platforms:

*   [X](https://x.com/rishi2220)
    
*   [LinkedIn](https://www.linkedin.com/in/rishi-ahuja-b1a224310/).
    

Your thoughts and feedback are always appreciated!