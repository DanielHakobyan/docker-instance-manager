import docker
import time

client = docker.from_env()

def list_containers():
    containers = client.containers.list(all=True)
    data = []
    
    for c in containers:
        # Get CPU/RAM usage
        try:
            stats = c.stats(stream=False)
            cpu_usage = stats["cpu_stats"]["cpu_usage"]["total_usage"]
            system_cpu = stats["cpu_stats"]["system_cpu_usage"]
            cpu_percent = (cpu_usage / system_cpu) * 100 if system_cpu else 0

            mem_usage = stats["memory_stats"]["usage"]
            mem_limit = stats["memory_stats"]["limit"]
            ram_percent = (mem_usage / mem_limit) * 100 if mem_limit else 0

        except:
            cpu_percent = 0
            ram_percent = 0

        data.append({
            "id": c.id,
            "name": c.name,
            "status": c.status,
            "cpu_limit": c.attrs["HostConfig"]["NanoCpus"] / 1e9,
            "ram_limit": c.attrs["HostConfig"]["Memory"],
            "cpu_usage": round(cpu_percent, 2),
            "ram_usage": round(ram_percent, 2),
        })

    return data


def create_container(name, cpu, ram):
    # Ensure minimum RAM
    min_ram_bytes = 6 * 1024 * 1024  # 6MB
    import re

    if ram.lower().endswith("m"):
        bytes_ram = int(re.findall(r'\d+', ram)[0]) * 1024 * 1024
    elif ram.lower().endswith("g"):
        bytes_ram = int(re.findall(r'\d+', ram)[0]) * 1024 * 1024 * 1024
    else:
        bytes_ram = int(ram)

    if bytes_ram < min_ram_bytes:
        bytes_ram = min_ram_bytes
        ram = f"{bytes_ram}b"

    nano_cpus = int(cpu * 1e9)

    container = client.containers.run(
        "ubuntu:latest",
        "sleep infinity",
        name=name,
        detach=True,
        nano_cpus=nano_cpus,
        mem_limit=ram
    )

    return container.id



def start_container(container_id):
    container = client.containers.get(container_id)
    container.start()
    return True


def stop_container(container_id):
    container = client.containers.get(container_id)
    container.stop()
    return True


def delete_container(container_id):
    container = client.containers.get(container_id)
    container.remove(force=True)
    return True
