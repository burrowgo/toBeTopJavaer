---
title: "What is DNS?"
---


## Overview
**DNS (Domain Name System)** is the phonebook of the Internet. Humans access information online through domain names, like `google.com` or `github.com`. Web browsers interact through Internet Protocol (IP) addresses. DNS translates domain names to IP addresses so browsers can load Internet resources.

## How DNS Works
When a user enters a domain name into their browser, a resolution process begins:
1.  **DNS Recursive Resolver:** The first stop, often managed by your ISP. It acts like a librarian asked to find a specific book.
2.  **Root Nameserver:** The first step in translating human-readable hostnames into IP addresses.
3.  **TLD Nameserver:** Top-Level Domain (TLD) server (e.g., for .com, .org).
4.  **Authoritative Nameserver:** The final stop. If the server has access to the requested record, it returns the IP address.

## Common Record Types
-   **A Record:** Maps a domain to an IPv4 address.
-   **AAAA Record:** Maps a domain to an IPv6 address.
-   **CNAME Record:** Aliases one domain to another.
-   **MX Record:** Directs mail to a mail server.
-   **TXT Record:** Allows administrators to insert arbitrary text into the DNS record.

## DNS Issues in 2026
-   **DNS Hijacking:** Redirecting users to a malicious website by changing DNS records.
-   **DNS Pollution:** Inserting incorrect IP addresses into a DNS cache.
-   **DNS over HTTPS (DoH):** Encrypting DNS queries to improve privacy and security, now a standard in 2026.
