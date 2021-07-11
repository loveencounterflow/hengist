#!/bin/bash
set -euo pipefail
home="$(realpath "$(realpath "${BASH_SOURCE[0]}" | xargs dirname)"/.)"
cd "$home"

intershop_db_name=mojikura
intershop_db_user=mojikura
intershop_db_port=5432
source '../../apps/intershop/intershop_modules/utilities.sh'
# postgres_paged -c 'select * from generate_series( -100, 100 )'
postgres_unpaged -c 'select * from generate_series( 1, 99 )'
sudo_postgres_unpaged -c 'select * from generate_series( 1, 99 )'
