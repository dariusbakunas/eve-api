-- Get warehouse stats
select warehouses.id, sum(wI.unitPrice * wI.quantity) as totalCost, sum(coalesce(sV.volume, invTypes.volume)) as volume from warehouses
    join warehouseItems wI on warehouses.id = wI.warehouseId
    join invTypes on invTypes.typeID = wI.typeId
    left join shipVolumes sV on invTypes.groupID = sV.groupId
    group by warehouses.id
