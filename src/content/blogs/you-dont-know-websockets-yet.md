---
title: "You Don't Know WebSockets. Yet."
brief: "Deep dive technical blog exploring WebSocket protocol, real-time communication patterns, and bidirectional data flow in modern web applications."
dateAdded: 2025-08-25T00:00:00.000Z
hashnodeUrl: "https://rishi2220.hashnode.dev/you-dont-know-websockets-yet"
readTimeInMinutes: 31
author: "Rishi Ahuja"
---
## WebSockets are deceptively simple af

If you’ve built a chat app recently (come to me and I will always give examples about chat apps) then you were kinda happy writing this code, and I know this.

```javascript
// Client-side JavaScript
const ws = new WebSocket('ws://api.fernkit.com/v1');

ws.onmessage = (event) => {
  console.log('New data just arrived!', event.data);
};
```

This simple API powers everything from real-time gaming to financial trading platforms, yet most developers treat it as a black box. Understanding what happens beneath this clean interface isn't just academic curiosity; it's essential for building robust, scalable real-time applications. When your WebSocket connections start dropping under load, when messages arrive out of order, or when you need to scale beyond a single server, you'll need this deeper understanding.

Looks simple, right? This clean API masks significant complexity. Behind those few lines of JavaScript lies a sophisticated protocol involving HTTP upgrades, binary frame parsing, and distributed system challenges that most developers never see.

In this post, we'll explore how WebSockets actually work by building a minimal server from scratch in C and examining the real bytes on the wire. We'll cover the handshake negotiation, frame structure, and the architectural decisions needed to scale WebSocket applications to handle millions of concurrent connections.

## Life before was just Request-Response

The web was built on HTTP, the Hypertext Transfer Protocol. It follows a simple transaction model. The client makes a request, and the server sends a response. The conversation is then over. The server hangs up, forgetting it ever knew you. It's a fundamentally **stateless** and **unidirectional** relationship, always initiated by the client.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1755941150542/062811a2-fc83-4269-9492-01bc5b26ca61.png align="center")

This is perfect for serving documents. It’s not good enough for building real-time applications. How do you get live updates if the server can't call you? So some hacks were found.

### Short Polling

The most brutish approach was to simply ask the server for updates over and over again.

```javascript
setInterval(async () => {
  const response = await fetch('/api/updates');
  const data = await response.json();
  if (data.new) {
    updateUI(data);
  }
}, 2000);
```

You can see why this was not it. It’s noisy, inefficient, and creates immense overhead. 99% of requests are wasted, returning no new information and bogging down the server.

### Long Polling

The client makes a request, but the server, if it has no new data, simply holds the connection open. It waits, silently, until it has something to say. Only then does it send the response.

While it reduced the latency and chattiness of short polling, it was still a workaround. It tied up server resources, was complex to manage, and was ultimately just a chain of requests pretending to be a persistent connection.

So we wanted something better.

### A Permanent Two-Way Comm

The web needed a native, first-class citizen for real, stateful, bidirectional communication. The answer was **RFC 6455**, the WebSocket protocol.

A WebSocket is pragmatic. It starts its life as a normal HTTP GET request, allowing it to sneak past firewalls and proxies that already speak HTTP. But this request carries a special payload: a set of `Upgrade` headers. It’s the client telling the server to ditch this formal request-response thing and switch to a private, persistent communication line.

If the server agrees, it responds with a `101 Switching Protocols` status. In that instant, HTTP is dead. The underlying TCP connection is hijacked and upgraded into a full-duplex, bidirectional pipeline. The server can now push data to the client whenever it wants, and the client can send data to the server at any time.

This is the foundation of the real-time web. But that simple `ws.onmessage` event handler hides everything.

## Upgrading HTTP

Before any real-time data is exchanged, the client and server must first agree to speak the WebSocket protocol. This negotiation process, obviously known as the **WebSocket Handshake**, occurs over HTTP. This initial use of HTTP is a pragmatic design choice, allowing WebSocket traffic to pass through existing network infrastructure like firewalls and proxies that are already configured to handle HTTP.

The handshake's primary goal is to transition the connection from the stateless, request-response model of HTTP to the persistent, full-duplex WebSocket protocol.

The process is initiated by the client with an HTTP/1.1 `GET` request. While it uses the standard HTTP format, specific headers signal its intent to establish a WebSocket connection.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1755942405871/41c963ad-4031-4c43-9b0e-2ca85b9b09a9.png align="center")

```http
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

Let's examine the essential headers:

*   `Upgrade: websocket`: A required header that informs the server of the client's desire to switch to the WebSocket protocol.
    
*   `Connection: Upgrade`: Indicates that the client wishes to change the protocol governing the connection.
    
*   `Sec-WebSocket-Version: 13`: Specifies the version of the WebSocket protocol the client wants to use. Version 13 is the definitive standard specified by RFC 6455.
    
*   `Sec-WebSocket-Key`: Contains a randomly generated, Base64-encoded 16-byte value. This key is not for authentication but serves as a challenge to the server to prove it understands the WebSocket protocol. This prevents a misconfigured HTTP server or cache from improperly handling the request.
    

A server that supports WebSockets will recognize these headers and perform a specific set of operations to formulate its response. This challenge-response mechanism is a core part of the handshake.

The server must derive an acceptance key using the following steps:

*   Take the value from the client's `Sec-WebSocket-Key` header.
    
*   Concatenate this value with the specific GUID (Globally Unique Identifier) defined in RFC 6455: `258EAFA5-E914-47DA-95CA-C5AB0DC85B11`.
    
*   Compute the SHA-1 hash of the resulting string.
    
*   Base64 encode the 20-byte binary hash generated by the SHA-1 function.
    

The formula can be expressed as:

$$\text{AcceptKey} = \text{Base64}\Big(\text{SHA1}\big(\text{ClientKey} \; + \; "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"\big)\Big)$$

For the example key `dGhlIHNhbXBsZSBub25jZQ==`, this calculation deterministically produces the value `s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`.

You might wonder why this specific GUID was chosen rather than any random string. The string `258EAFA5-E914-47DA-95CA-C5AB0DC85B11` serves as a protocol fingerprint; it proves the server actually understands WebSockets rather than just echoing back headers. This prevents accidental protocol confusion where a regular HTTP server might accidentally appear to support WebSockets.

The server sends its response back to the client. A successful response confirms the protocol switch.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1755942763845/83b23ffc-e9ee-4d87-bccf-0edfedafe4ed.png align="center")

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

*   `HTTP/1.1 101 Switching Protocols`: This status code confirms that the server is accepting the client's upgrade request.
    
*   `Upgrade` & `Connection`: These headers are echoed back by the server to confirm the protocol change.
    
*   `Sec-WebSocket-Accept`: Contains the key derived by the server. The client will verify this key to confirm it is communicating with a valid WebSocket server.
    

Upon successful validation of the `Sec-WebSocket-Accept` key by the client, the handshake is complete. The HTTP layer is discarded, and the underlying TCP connection is repurposed as a persistent channel for transmitting WebSocket data.

With the connection established, we can now examine the structure of the data that travels over this channel. Unlike HTTP's plain-text messages, WebSocket communication uses a binary framing format.

You can see this in your network tab after connecting to a `wss` server. [here](https://piehost.com/websocket-tester)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1755943037103/44666f66-5dfb-4618-a3ff-d37d94f05bdf.png align="center")

## The Language of WebSockets

With a persistent connection established by the handshake, the client and server can begin exchanging data. This communication does not happen over plain text like in HTTP/1.1. Instead, the WebSocket protocol defines a specific binary format for all data transmission called a **frame**.

Every piece of information, from application data to protocol-level control signals, is encapsulated within these frames before being sent over the TCP connection. Understanding this structure is essential to understanding how the protocol achieves its efficiency and supports features like message fragmentation, different data types, and robust connection management.

### Anatomy of a WebSocket Frame

Each WebSocket frame consists of a header, which is 2 to 14 bytes long, followed by a variable-length payload. The header contains critical metadata describing the payload and how to interpret it.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1755986233963/ad1d94c6-afb9-46d0-8fd8-cd517d475b0d.png align="center")

The fields in the frame header are defined as follows:

*   `FIN` (1 bit): The Final Fragment bit. A value of `1` indicates that this frame is the final, or only, frame of a message. A `0` indicates that the message is fragmented and more frames will follow.
    
*   `RSV1, RSV2, RSV3` (3 bits): Reserved for extensions. In the absence of negotiated extensions, these bits must be `0`. They are used to multiplex extra features onto the protocol, such as compression.
    
*   `Opcode` (4 bits): The Op Code determines how to interpret the payload data. We will explore these in detail shortly.
    
*   `MASK` (1 bit): Defines whether the payload is masked (encoded with an XOR cipher). All frames sent from the client to the server **must** be masked. This is a critical security feature.
    
*   `Payload length` (7, 7+16, or 7+64 bits): An encoded representation of the payload's length in bytes.
    
    *   If the value is 0-125, it is the payload length.
        
    *   If the value is 126, the following 2 bytes contain the actual 16-bit payload length.
        
    *   If the value is 127, the following 8 bytes contain the actual 64-bit payload length.
        
*   `Masking-key` (32 bits / 4 bytes): If the `MASK` bit is set, this field contains a 32-bit key used to mask the payload data. A new, random key is generated by the client for every single frame.
    
*   `Payload data`: The application data itself. If the frame is masked, the data must be unmasked by the receiver before it can be used.
    

### More on Opcodes

The opcode is the primary field that tells the receiver what to do with the frame.

#### Data Opcodes

*   `0x1` (**Text**): The payload contains UTF-8 encoded text.
    
*   `0x2` (**Binary**): The payload contains arbitrary binary data, such as an image, audio, or a serialized Protobuf message.
    
*   `0x0` (**Continuation**): This frame continues a message started in a previous frame. It allows large messages to be fragmented, with the first frame carrying an opcode of `0x1` or `0x2` and a `FIN` bit of `0`, followed by one or more continuation frames. The final frame in the sequence will have a `FIN` bit of `1`.
    

#### Control Opcodes

Control frames are for protocol-level communication, not application data. They cannot be fragmented (`FIN` must be `1`) and their payload must be 125 bytes or less.

*   `0x8` (**Close**): Initiates a graceful connection shutdown. It can optionally contain a status code and reason.
    
*   `0x9` (**Ping**): A heartbeat used to verify the connection is alive. The recipient must respond with a Pong frame as soon as possible.
    
*   `0xA` (**Pong**): The mandatory response to a Ping frame. It must echo the payload of the Ping it is responding to.
    

Reserved opcodes (`0x3-0x7` and `0xB-0xF`) are unused and will cause a connection to fail if received.

### Masking Details

A mandatory feature of the protocol is that every frame from the client to the server must be masked.

Here's masking with a simple example:

*   Original message: "Hi" (bytes: `0x48 0x69`)
    
*   Masking key: `0x12 0x34 0x56 0x78`
    
*   Masked result: `0x48 ⊕ 0x12 = 0x5A`, `0x69 ⊕ 0x34 = 0x5D`
    
*   Server receives `0x5A 0x5D`, applies the same XOR, and recovers "Hi"
    

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">This masking is asymmetric; only client-to-server frames must be masked. Server-to-client frames are sent unmasked. This asymmetry exists because the security vulnerability (cache poisoning) only affects client-originated traffic passing through proxies. Server responses don't face this risk, so the protocol avoids the unnecessary CPU overhead of masking them.</div>
</div>

Now, why is this mandatory? The reason involves a subtle security vulnerability known as **proxy cache poisoning**.

A Scenario without masking:

1.  An attacker crafts a malicious JavaScript payload that looks like a valid HTTP request (e.g., `GET /important.js HTTP/1.1...`).
    
2.  A user visits the attacker's site, and this script opens a WebSocket connection, sending the malicious payload as an unmasked frame.
    
3.  A transparent caching proxy server sitting between the user and the internet sees this traffic. It doesn't understand WebSockets but sees what looks like a standard HTTP request inside the data stream.
    
4.  The WebSocket server, receiving this malformed frame, might send back an error message (e.g., an HTML error page).
    
5.  The proxy sees the WebSocket server's error page and incorrectly caches it as the valid response for the *attacker's crafted request* (`GET /important.js`). The cache is now poisoned.
    
6.  When a legitimate user later requests `/important.js` through that same proxy, they receive the cached error page instead of the actual script, breaking the site for them.
    

Masking neutralizes this threat. By XORing the payload with a new, random 4-byte key for every frame, the client-side data is transformed into what looks like random binary garbage to any intermediary. The proxy can no longer find a pattern that looks like an HTTP request, so it cannot be tricked into poisoning its cache.

### A Brief about Extensions

The three `RSV` bits in the frame header are reserved for protocol extensions. These are extra features, like compression, that are negotiated during the initial handshake. The most common extension is `permessage-deflate`, which uses the DEFLATE algorithm to compress messages. When this extension is active, a frame with the `RSV1` bit set to `1` indicates that its payload is compressed and must be decompressed by the receiver. This can significantly reduce bandwidth at the cost of some CPU overhead.

### Deconstructing a Complex Frame: An Example

To put this all together, let's analyze a raw byte stream for a masked text frame containing a 300-byte message. This will require the extended payload length field.

Raw Frame Data (Hexadecimal):

```plaintext
81 FE 01 2C 1a 2b 3c 4d 5b 6a 77 0c ... (296 more payload bytes)
```

Let's interpret this byte by byte:

1.  **Byte 1:** `0x81` (`10000001`)
    
    *   `FIN=1`: This is the final frame of the message.
        
    *   `Opcode=0x1`: This is a **Text Frame**.
        
2.  **Byte 2:** `0xFE` (`11111110`)
    
    *   `MASK=1`: The payload is masked. This frame originated from a client.
        
    *   `Payload Length=126`: This is a special value indicating that the actual length is contained in the next two bytes.
        
3.  **Bytes 3-4:** `0x01 0x2C`
    
    *   These two bytes represent the 16-bit extended payload length. `0x012C` in hexadecimal is `300` in decimal. We now know the payload is 300 bytes long.
        
4.  **Bytes 5-8:** `0x1a 0x2b 0x3c 0x4d`
    
    *   Because the `MASK` bit was `1`, these four bytes are the **Masking-key**.
        
5.  **Bytes 9-308:**
    
    *   This is the 300-byte masked payload. To read the original message, the server must perform an XOR operation on each byte of the payload with the corresponding byte of the repeating masking key.
        
6.  For example, the first payload byte `0x5b` is unmasked by calculating `0x5b ⊕ 0x1a` (the first key byte), which results in `0x41`, the ASCII code for the letter 'A'. The second payload byte `0x6a` is unmasked by calculating `0x6a ⊕ 0x2b` (the second key byte), which also results in `0x41`, and so on.
    

After unmasking the entire payload, the server would have successfully reconstructed the original 300-character string. This framing mechanism is the fundamental building block upon which all WebSocket communication is built.

## Building the Engine Room in C

We have dissected the WebSocket protocol, from its handshake negotiation to the binary structure of its frames. The theory is sound, but to truly understand a system, one must build it. In this section, we will implement a minimal WebSocket server from scratch in C, piece by piece.

Our goal is to write just enough code to make the protocol's mechanics tangible. We will start with a foundational TCP server and incrementally layer on the logic required to handle the WebSocket handshake.

### TCP Foundation

WebSockets are an application-layer protocol built on top of TCP. Therefore, any WebSocket server must first be a competent TCP server. In C on a POSIX-compliant system (like Linux or macOS), this involves using the standard socket API.

The server's lifecycle follows a standard pattern: `socket() → bind() → listen() → accept()`.

1.  `socket()`: Create a network endpoint.
    
2.  `bind()`: Assign an address and port to the endpoint.
    
3.  `listen()`: Enable the endpoint to accept incoming connections.
    
4.  `accept()`: Wait for a client to connect and, upon connection, create a new socket for communication with that specific client.
    

Let's create our initial file, `server.c`. This code will set up a listening socket on port 8080, wait for a single client to connect, and then immediately close the connection and exit.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>

#define PORT 8080

int main() {
    int server_fd, client_socket;
    struct sockaddr_in address;
    int opt = 1;
    int addrlen = sizeof(address);

    // Create socket file descriptor
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("socket failed"); exit(EXIT_FAILURE);
    }

    // Set socket options to allow address and port reuse
    if (setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt))) {
        perror("setsockopt"); exit(EXIT_FAILURE);
    }
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY; // Listen on 0.0.0.0
    address.sin_port = htons(PORT);

    // Bind the socket to the network address and port
    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        perror("bind failed"); exit(EXIT_FAILURE);
    }

    // Start listening for connections
    if (listen(server_fd, 3) < 0) {
        perror("listen"); exit(EXIT_FAILURE);
    }
    printf("Server listening on port %d\n", PORT);

    // Accept an incoming connection
    if ((client_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen)) < 0) {
        perror("accept"); exit(EXIT_FAILURE);
    }

    printf("Client connected.\n");

    // We will add logic here in the next steps...

    close(client_socket);
    close(server_fd);
    return 0;
}
```

Compile and run this (`gcc server.c -o server`). It will listen, but it doesn't do anything useful yet. Let's change that.

### Step 2: Receiving the Client's Request

Now, let's modify our server to read the data the client sends immediately after connecting. We know this will be an HTTP `GET` request. We'll add a buffer and a `read()` call to capture this data and print it to the console.

```c
// ... inside main(), after accept() ...

    printf("Client connected.\n");

    // ADD THIS BLOCK
    char buffer[2048] = {0};
    read(client_socket, buffer, 2048);
    printf("--- Client Request ---\n%s\n---------------------\n", buffer);
    // END ADD

    close(client_socket);
// ...
```

Recompile and run the server. Now, from another terminal, test it with `curl`: `curl` [`http://localhost:8080`](http://localhost:8080)

### Step 3: Adding the Cryptography Tools

To handle the handshake, we need two key pieces of functionality: a SHA-1 hashing algorithm and a Base64 encoder. C doesn't provide these in its standard library.

**For SHA-1 and Base64** we will use the robust and widely available OpenSSL `libcrypto`.

```c
#include <openssl/sha.h>
#include <openssl/bio.h>

char *base64_encode(const unsigned char *input, size_t input_len) {
    BIO *b64 = BIO_new(BIO_f_base64());
    BIO *bmem = BIO_new(BIO_s_mem());
    BIO_set_flags(b64, BIO_FLAGS_BASE64_NO_NL);
    bmem = BIO_push(b64, bmem);
    BIO_write(bmem, input, input_len);
    BIO_flush(bmem);
    BUF_MEM *bptr;
    BIO_get_mem_ptr(bmem, &bptr);
    char *buff = (char *)malloc(bptr->length + 1);
    memcpy(buff, bptr->data, bptr->length);
    buff[bptr->length] = 0;
    BIO_free_all(bmem);
    return buff;
}
```

We haven't used these functions yet, but our source file is now equipped with the necessary tools. To compile from here on, you will need to link the OpenSSL crypto library: `gcc server.c -o server -lssl -lcrypto`

### Step 4: Implementing the Handshake Logic

This is the final step. We will replace the simple "print the request" logic with code that:

1.  Parses the `Sec-WebSocket-Key`.
    
2.  Generates the `Sec-WebSocket-Accept` key using our new crypto tools.
    
3.  Constructs and sends the `101 Switching Protocols` response.
    

**Modify** `server.c` - Step 4

```c
// ... inside main(), after accept() ...

    char buffer[2048] = {0};
    read(client_socket, buffer, 2048);
    printf("--- Client Handshake Request ---\n%s\n-----------------------------\n", buffer);
    
    // 1. Parse the WebSocket Key from the client's handshake
    char *key_start = strstr(buffer, "Sec-WebSocket-Key: ");
    if (key_start == NULL) {
        // Handle error: key not found
        close(client_socket); return 1;
    }
    key_start += 19; // Move pointer to the start of the key value
    char *key_end = strstr(key_start, "\r\n");
    if (key_end == NULL) {
        // Handle error: key format invalid
        close(client_socket); return 1;
    }
    char client_key[256];
    strncpy(client_key, key_start, key_end - key_start);
    client_key[key_end - key_start] = '\0';

    // 2. Generate the WebSocket Accept Key
    const char *magic_string = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    char combined_key[512];
    sprintf(combined_key, "%s%s", client_key, magic_string);

    unsigned char sha1_hash[SHA_DIGEST_LENGTH];
    SHA1((const unsigned char *)combined_key, strlen(combined_key), sha1_hash);

    char *accept_key = base64_encode(sha1_hash, SHA_DIGEST_LENGTH);

    // 3. Construct and send the handshake response
    char response[BUFFER_SIZE];
    sprintf(response, "HTTP/1.1 101 Switching Protocols\r\n"
                      "Upgrade: websocket\r\n"
                      "Connection: Upgrade\r\n"
                      "Sec-WebSocket-Accept: %s\r\n\r\n", accept_key);

    write(client_socket, response, strlen(response));
    printf("--- Server Handshake Response ---\n%s\n----------------------------\n", response);
    printf("Handshake complete. WebSocket connection established.\n");

    // Free the dynamically allocated accept_key
    free(accept_key);
    // END REPLACE

    // The connection is now open for frame-based communication...
    // We will add frame parsing in the next part of the blog.
    
    // ... rest of main() ...
```

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">This C code omits comprehensive error handling for clarity. Good code should validate all read() operations and handle partial reads.</div>
</div>

### Final Test

With the complete code from Step 4, compile and run your server one last time. `gcc server.c -o server -lssl -lcrypto` `./server`

Now, go to your browser's JavaScript console and execute the test script:

```javascript
let socket = new WebSocket('ws://localhost:8080');
socket.onopen = () => console.log('WebSocket connection opened');
socket.onclose = () => console.log('WebSocket connection closed');
```

Your server terminal will show the full handshake negotiation.

We have incrementally built a C program that correctly implements the WebSocket protocol handshake. Our server has successfully completed the WebSocket handshake. It cannot yet understand frames, but it has correctly upgraded the connection. Good Stuff!

## Implementing the Frame Processing Loop

Our server can now successfully complete the WebSocket handshake. The final step in creating a functional echo server is to implement the logic that processes incoming data frames. This involves creating a loop that reads from the socket, decodes the frame structure we learned about in Part 3, and acts upon the received message.

### Adding the Core Logic

Directly after the handshake code in your `main` function, we will add a `while(1)` loop. This loop is the new heart of our server. It will continuously read, parse, and respond to WebSocket frames.

The code below contains the complete logic. It uses bitwise operations to decode the header, handles extended payload lengths, unmasks the client's message, and uses a `switch` statement to handle different opcodes. For text messages (`opcode 0x1`), it constructs and sends an unmasked echo response. For close messages (`opcode 0x8`), it terminates the connection.

**Add the following code block inside** `main()`, after the handshake response is sent:

```c
// ... after printf("Handshake complete...\n"); ...
#define MAX_FRAME_SIZE 65536  // Add this at top of file with other defines

// Helper function to read exact number of bytes
ssize_t read_exactly(int fd, void *buf, size_t count) {
    size_t total_read = 0;
    char *ptr = (char*)buf;
    
    while (total_read < count) {
        ssize_t n = read(fd, ptr + total_read, count - total_read);
        if (n <= 0) return n; // Error or EOF
        total_read += n;
    }
    return total_read;
}

// --- Enter the main frame processing loop ---
while(1) {
    unsigned char header[2];
    if (read_exactly(client_socket, header, 2) <= 0) {
        printf("Client disconnected or error reading header.\n");
        break;
    }

    // Validate frame structure
    unsigned char fin = (header[0] & 0x80) >> 7;
    unsigned char rsv = (header[0] & 0x70) >> 4;
    unsigned char opcode = header[0] & 0x0F;
    unsigned char masked = (header[1] & 0x80) >> 7;
    uint64_t payload_len = header[1] & 0x7F;

    // RSV bits must be 0 unless extensions are negotiated
    if (rsv != 0) {
        printf("Invalid frame: RSV bits must be 0\n");
        break;
    }

    // Client frames must be masked
    if (!masked) {
        printf("Invalid frame: client frames must be masked\n");
        break;
    }

    // Read extended payload length if needed
    if (payload_len == 126) {
        uint16_t len16;
        if (read_exactly(client_socket, &len16, 2) <= 0) break;
        payload_len = ntohs(len16);
    } else if (payload_len == 127) {
        uint64_t len64;
        if (read_exactly(client_socket, &len64, 8) <= 0) break;
        payload_len = be64toh(len64);
        // Check for reasonable size limits
        if (payload_len > MAX_FRAME_SIZE) {
            printf("Frame too large: %lu bytes\n", payload_len);
            break;
        }
    }

    // Validate payload size
    if (payload_len > MAX_FRAME_SIZE) {
        printf("Frame payload too large: %lu bytes\n", payload_len);
        break;
    }

    // Read masking key
    unsigned char masking_key[4];
    if (read_exactly(client_socket, masking_key, 4) <= 0) break;

    // Allocate payload buffer safely
    char *payload_data = malloc(payload_len + 1);
    if (!payload_data) {
        printf("Memory allocation failed\n");
        break;
    }

    // Read and unmask payload
    if (read_exactly(client_socket, payload_data, payload_len) <= 0) {
        free(payload_data);
        break;
    }

    for (uint64_t i = 0; i < payload_len; i++) {
        payload_data[i] ^= masking_key[i % 4];
    }
    payload_data[payload_len] = '\0';

    // Handle different opcodes
    switch (opcode) {
        case 0x1: // Text Frame
            printf("Received Text: %s\n", payload_data);
            
            // Send echo response with proper length encoding
            unsigned char response[10 + payload_len]; // Max header + payload
            size_t header_len = 0;
            
            response[0] = 0x81; // FIN=1, opcode=0x1
            
            if (payload_len < 126) {
                response[1] = payload_len; // No masking bit
                header_len = 2;
            } else if (payload_len < 65536) {
                response[1] = 126;
                uint16_t len16 = htons(payload_len);
                memcpy(&response[2], &len16, 2);
                header_len = 4;
            } else {
                response[1] = 127;
                uint64_t len64 = htobe64(payload_len);
                memcpy(&response[2], &len64, 8);
                header_len = 10;
            }
            
            memcpy(response + header_len, payload_data, payload_len);
            write(client_socket, response, header_len + payload_len);
            break;

        case 0x8: // Close Frame
            printf("Client sent close frame. Closing connection.\n");
            
            // Send close frame response
            unsigned char close_response[2] = {0x88, 0x00}; // Close frame, no payload
            write(client_socket, close_response, 2);
            
            free(payload_data);
            close(client_socket);
            close(server_fd);
            return 0;

        case 0x9: // Ping Frame
            printf("Received ping frame\n");
            
            // Respond with pong frame (echo payload)
            unsigned char pong_header[2] = {0x8A, payload_len}; // Pong opcode
            write(client_socket, pong_header, 2);
            write(client_socket, payload_data, payload_len);
            break;

        default:
            printf("Unsupported opcode: 0x%X\n", opcode);
            break;
    }
    
    free(payload_data);
}
```

Now we can test sending data through our client:

```javascript
let socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
    console.log('Connection opened!');
    console.log('Sending message to server...');
    socket.send('Hello from the browser!');
};

socket.onmessage = (event) => {
    console.log('Received from server:', event.data);
};

socket.onclose = (event) => {
    console.log(`Connection closed. Code: ${event.code}, Reason: ${event.reason}`);
};
```

It should work, hopefully!

Our C server handles the protocol correctly, but it's limited to one client at a time. Production WebSocket servers typically handle 10,000-50,000 concurrent connections per server instance, depending on hardware and message frequency. At 1,000 messages/second across 10,000 connections, you're processing 10 million messages/second - far beyond what our simple blocking I/O implementation can handle.

Let's try scaling WebSocket applications beyond a single server using abstractions.

## Scaling WebSockets

Scaling traditional, stateless HTTP APIs is a well-solved problem. If you get more traffic, you just add more identical web servers behind a load balancer. Since each HTTP request is independent and contains all the information needed to process it, any server can handle any request. The servers don't need to remember anything about the client from one moment to the next.

WebSockets break this simple model entirely because of **state**.

Before seeing into distributed architecture, let's understand what each WebSocket connection actually costs your server:

**File Descriptors:** Every network connection requires a file descriptor - a kernel resource that represents the open socket. Linux processes default to a limit of 1,024 file descriptors (`ulimit -n`). This means your server will refuse new connections after roughly 1,000 clients, regardless of available CPU or memory.

**Memory Overhead:** Each connection consumes:

*   **4-8KB for socket buffers**
    
*   **~1KB for connection metadata** in your application (user ID, room associations, etc.)
    
*   **Additional heap allocation** for any queued messages or application state
    

At 10,000 connections, you're looking at 50-90MB of memory before any application logic runs.

Kernel Tuning is required in Production WebSocket servers need system-level configuration:

```bash
# Increase file descriptor limits
echo "* soft nofile 65536" >> /etc/security/limits.conf
echo "* hard nofile 65536" >> /etc/security/limits.conf

# Tune TCP parameters for many connections
echo 'net.core.somaxconn = 65536' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_max_syn_backlog = 65536' >> /etc/sysctl.conf
```

Our simple C server uses blocking I/O - one thread per connection. At 1,000 connections, you'd need 1,000 threads, each with a 1-8MB stack. That's potentially 8GB of memory just for thread stacks, plus catastrophic context switching overhead.

This is why production servers use event-driven architectures (epoll/kqueue) that can handle 50,000+ connections with just a few threads. But that complexity is exactly what WebSocket libraries abstract away.

### Stateful Connections

It is well established now that a WebSocket connection is a persistent, long-lived TCP connection between a specific client and a *specific server*. Server A in your cluster has an open socket to User 1. Server B has an open socket to User 2. Server A knows nothing about User 2, and Server B knows nothing about User 1. They are isolated from the state.

This creates a problem the moment your users need to interact with each other.

### Simple Chatroom example

Let's see with the classic example, a chat room application distributed across multiple servers.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1756044449473/1b292267-31c4-480e-91ae-56dd6ed9e823.png align="center")

Now, let's trace a message:

1.  **A**, who is connected to **Server 1**, types "Hello!" and sends the message.
    
2.  **Server 1** receives the frame. It checks its internal list of connected clients and sees that B and C are also connected to it and are in the same chat room.
    
3.  **Server 1** forwards the message to B and C. They see it instantly.
    
4.  D, E, and F, who are connected to **Server 2**, receive nothing. Server 1 has no knowledge of Server 2 or the clients connected to it. The message hits a dead end, and the chat room is effectively partitioned and broken.
    

### Sticky Sessions

Sticky sessions or session affinity on load balancer configures the load balancer to send all requests from a particular user (identified by IP address or a cookie) to the *same* server every time.

While this can be alright for some stateful applications, for WebSockets, it's a trap. It does **not** solve the core problem.

*   Even with sticky sessions, A (stuck to Server 1) still has no way to talk to D (stuck to Server 2). The chat room remains broken.
    
*   If Server 1 crashes, A, B, and C are all disconnected. Worse, if one chat room becomes extremely popular, all its users might get stuck to a single server, overwhelming it while other servers in the cluster sit idle.
    

Sticky sessions don't address communication across the server.

To solve this, we must decouple the responsibility of connection management from the responsibility of message routing. We need a shared backend that all our WebSocket servers can plug into. This is often called a **message broker** or **event bus**.

This separates the two main jobs:

*   WebSocket Servers only task is to handle the connections from clients.
    
*   Shared Messaging System takes messages from one server and distribute them to all the others.
    

We’ll first try to use Redis, an in-memory data store with Publish/Subscribe (or Pub/Sub).

*   For our app, we can have a channel for each chat room, like `chat-room-123`.
    
*   When a server gets a message from a client, it publishes that message to the correct channel in Redis. The server doesn't need to know who is listening.
    
*   All of our WebSocket servers will subscribe to the channels they care about. Any message published to that channel is immediately received by all subscribed servers.
    

This apparently solves our chat room problem. A is connected to Server 1, and D is connected to Server 2.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1756045523549/dbd3ba62-e3d1-4f2f-851a-52b799da5228.png align="center")

Here’s the step-by-step flow:

1.  A (on Server 1) sends her message "Hello!" to `room-123`.
    
2.  Server 1 receives it. Instead of trying to find other users, it simply sends a command to Redis: `PUBLISH room-123 "Hello!"`.
    
3.  Redis gets the command and immediately broadcasts the message to every server that is subscribed to `room-123`. In this case, both Server 1 and Server 2 get the message.
    
4.  When **Server 1** gets the message *from Redis*, it looks at its list of connected clients and sends the message to B and C.
    
5.  When **Server 2** gets the message *from Redis*, it does the same, sending it to D, E, F.
    

The message is distributed to every user in the chat room, no matter which server they're connected to.

### The Pros and Cons of Redis

#### The Pros

*   Redis runs in memory, so sending messages is fast af. This makes our application feel very responsive.
    
*   The Pub/Sub commands (`PUBLISH`, `SUBSCRIBE`) are straightforward and easy to add to your code.
    
*   Redis itself can handle a very high number of messages and can be scaled up if needed.
    

#### The Cons

*   Basic Pub/Sub doesn't persist messages. Messages are broadcast to current subscribers only. However, Redis offers persistence options like RDB snapshots and AOF (Append Only File) for durability, and Redis Streams provide message persistence with consumer groups.
    
*   No delivery guarantees with basic Pub/Sub. If a WebSocket server temporarily loses connection to Redis, it will miss messages sent during that time. For applications requiring guaranteed delivery, consider Redis Streams or Apache Kafka instead.
    

For applications where every message is important, financial systems, audit logs, or any scenario where losing messages is not possible, we can’t just store data in memory. We need something that allows us to persist the data on disk.

### Apache Kafka

Kafka is fundamentally different from a simple message broker. It is a distributed, persistent commit log. This means every message is written to an ordered, append-only log on disk.

*   Kafka has Logs. Logs are an ordered, append-only sequence of records. When a new message comes in, it's simply added to the end of a write-ahead log (WAL). The data in the log is persisted to disk instead of in memory, and is immutable; it cannot be changed or deleted (until a configured retention period expires, which could be days, weeks, or forever).
    
*   A log for a specific type of data is called a topic in Kafka terms (e.g., `room-123-messages`). To allow for scalability and parallel processing, a topic is broken down into multiple logs called partitions. For example, `room-123-messages` topic might have 4 partitions. Each message is written to one of these partitions, and Kafka guarantees that all messages within a single partition are strictly ordered.
    
*   Producers are applications that write data to Kafka topics. In our architecture, our WebSocket servers act as producers whenever they receive a message from a client.
    
*   Consumers are applications that read data from topics. Our WebSocket servers *also* act as consumers to receive messages that they need to send to their connected clients.
    
*   Kafka doesn't track which messages have been read. It's a dumb log. Instead, each consumer is responsible for tracking its own position in each partition's log. The position is called an offset. For example, a consumer might say that they had read up to offset 100 in Partition 0 of the `room-123` topic. If a consumer crashes and restarts, it just starts reading from its last saved offset, ensuring it doesn't miss any data.
    
*   This design guarantees that messages are not lost just because a consumer was temporarily offline.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1756054365448/b32a3fce-e633-4775-975d-0c64aba34a32.png align="center")

To broadcast messages to *all* of our WebSocket servers, we need to configure our consumers in a specific way. In Kafka, consumers are organized into Consumer Groups. If multiple consumers share the same group ID, Kafka will distribute the partitions among them, so each message is only handled by *one* consumer in that group. This is great for distributing work, but it's not what we want.

For our use case, we need every server to receive every message. We achieve this by ensuring each of our WebSocket server instances subscribes to the topic with its own, unique consumer group ID. By doing this, Kafka treats each server as an independent subscriber and delivers a copy of all messages to every single one of them.

1.  A (on Server 1) sends a message to `room-123`.
    
2.  Server 1 acts as a Producer, writing the message to the `room-123-messages` Kafka topic. Kafka appends it to a partition and assigns it an offset.
    
3.  Server 1, Server 2, and Server 3 are all running as Consumers, each with a unique [`group.id`](http://group.id). They are all polling the topic for new messages.
    
4.  Kafka sees the new message and delivers it to all three independent consumer groups (meaning, to all three servers).
    
5.  Each server receives the message, checks its local list of connected clients for that chat room, and forwards the message.
    

If Server B was restarting, it would be a non-issue. When it came back online, it would reconnect to Kafka with its unique group ID, check its last saved offset, and immediately receive all the messages it missed while it was down.

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">Consider writing to disk is tons slower than in-memory data structures like Redis, so Kafka's latency is still very low (typically single-digit milliseconds), but it's not the sub-millisecond speed of Redis.</div>
</div>

## **Conclusion**

The goal of this post was to look past the straightforward WebSocket API and understand the protocol's core functions. We examined the initial HTTP upgrade, the structure of data frames, and the operational challenges of scaling stateful connections. Moving from a single C server to a more robust architecture with Kafka, we addressed the practical problems of building real-time applications at scale.

The simplicity you see in the browser is built on these complex, efficient solutions.

Thanks for following along.

I'm always open to discussion and feedback. You can find me here:

*   [**X**](https://x.com/rishi2220)
    
*   [**LinkedIn**](https://www.linkedin.com/in/rishi-ahuja-b1a224310/)