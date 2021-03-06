<?php

namespace CubeTools\CubeCommonBundle\Entity\Common;

/**
 * To be used in entities for notification system.
 * Connection to entity (ManyToOne) using NotificationsIntervalsTrait have to be made in class using this entity.
 */
trait NotificationsTrait
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string entity class
     *
     * @ORM\Column(name="entityClass", type="string")
     */
    private $entityClass;

    /**
     * @var int id of entity (if null - or entities are taken into account)
     *
     * @ORM\Column(name="entityId", type="integer", nullable=true)
     */
    private $entityId;

    /**
     * @var array null means, that every change causes notification
     *
     * @ORM\Column(name="triggerChangedColumns", type="simple_array", nullable=true)
     */
    private $triggerChangedColumns;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     *
     * @param string $entityClass
     *
     * @return $this
     */
    public function setEntityClass($entityClass)
    {
        $this->entityClass = $entityClass;

        return $this;
    }

    /**
     * @return string
     */
    public function getEntityClass()
    {
        return $this->entityClass;
    }

    /**
     *
     * @param int $entityId
     *
     * @return $this
     */
    public function setEntityId($entityId)
    {
        $this->entityId = $entityId;

        return $this;
    }

    /**
     * @return int
     */
    public function getEntityId()
    {
        return $this->entityId;
    }

    /**
     * @param array $triggerChangedColumns
     *
     * @return $this
     */
    public function setTriggerChangedColumns($triggerChangedColumns)
    {
        $this->triggerChangedColumns = $triggerChangedColumns;

        return $this;
    }

    /**
     * @return array
     */
    public function getTriggerChangedColumns()
    {
        return $this->triggerChangedColumns;
    }
}
