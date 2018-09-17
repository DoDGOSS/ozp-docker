# Usage

## Instructions

1. Modify the `checkout.sh` script `REPOSITORY` variable to the OZP repository root URL.
2. Run the `checkout.sh` script.
   This will check out the appropriate repositories into the `src/` folder.
   _(Note: This step only needs to be done once; after the repositories are checked out, they may be used as normal git repositories.)_
3. Run the `sync-src.sh` script.
   This will copy the repositories from the `src/` folder to the individual container folders.
4. Run the `start-ozp.sh` script.
   This will build and start the containers 
5. After all the containers have started, open a web browser to OZP Center at [http://localhost:8000/dist](http://localhost:8000/dist)
6. When prompted for credentials, enter the username `wsmith` with the password `password`.

## Ports

**The following ports must be available on the host machine:**

```
8000  - OZP Center front-end
8001  - OZP API back-end
8002  - OZP Demo Apps
8003  - OZP Demo Auth service
8004  - OZP HUD
9000  - OZP Webtop (Development)
9001  - OZP Webtop (Test)
9010  - OZP Webtop (Documentation)
9037  - OZP Webtop (Production)
9600  - OZP Webtop (Data utility)
9601  - OZP Webtop (Sticky state demo)
35729 - OZP Webtop (Webpack live reload)
```

## Development

The `src/` folder contains the repositories used to build the projects.

Any source changes should be made in this folder, and then the `sync-src.sh` script used to copy the changes to the container folders.

After `sync-src.sh` has been run, the containers may be rebuilt and started to test the changes.

Alternatively you can run the desired `redeploy-*.sh` script to sync and rebuild an individual module of OZP. 

Since the folders under `src/` are git repositories, once any changes there have been tested, they may be committed and pushed back to the main repository.

### Patch Folder

The `patch/` folder is primarily for changes that should not be committed back into the primary repositories.

For example, it includes changes to the project `package.json` files to point to file paths local to the containers, rather than the original GitHub repositories.


### Development Scripts

**The following scripts are provided to manage the OZP containers:**

- `start-ozp.sh`
  Run all containers (using `docker-compose`)
- `stop-ozp.sh`
  Stop all containers (using `docker-compose`)

**Additional scripts are provided for source synchronization and container management during development:**

- `sync-src.sh`
  Synchronize changes from all of the modules into their respective container directories.
- `redeploy-api.sh`
  Synchronize changes from src/ozp-backend/ and rebuild the ozp_api container.
- `redeploy-center.sh`
  Synchronize changes from src/ozp-center/ and rebuild the ozp_center container.
- `redeploy-hud.sh`
  Synchronize changes from src/ozp-hud/ and rebuild the ozp_hud container.
- `redeploy-webtop.sh`
  Synchronize changes from src/ozp-hud/ and rebuild the ozp_webtop container.


