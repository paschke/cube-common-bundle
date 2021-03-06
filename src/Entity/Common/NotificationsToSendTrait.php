<?php

namespace CubeTools\CubeCommonBundle\Entity\Common;

/**
 * To be used in entities for notifications to be send.
 * Connection to entity (ManyToOne) using NotificationsTrait have to be made in entity using this trait.
 */
trait NotificationsToSendTrait
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
     * @var int id of entity, for which notification is made (important when all data from one entityType is watched)
     *
     * @ORM\Column(name="entityId", type="integer", nullable=false)
     */
    protected $entityId;

    /**
     * @var string content of message to be send to user
     *
     * @ORM\Column(name="message", type="string")
     */
    private $message;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="dateOfExecution", type="datetime", nullable=false)
     */
    private $dateOfExecution;

    /**
     * @var string content of message to be send to user
     *
     * @ORM\Column(name="isExecuted", type="boolean")
     */
    private $isExecuted;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
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
     *
     * @param string $message
     *
     * @return $this
     */
    public function setMessage($message)
    {
        $this->message = $message;

        return $this;
    }

    /**
     * @return string
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     *
     * @param \DateTime $dateOfExecution
     *
     * @return $this
     */
    public function setDateOfExecution($dateOfExecution)
    {
        $this->dateOfExecution = $dateOfExecution;

        return $this;
    }

    /**
     * @return string
     */
    public function getDateOfExecution()
    {
        return $this->dateOfExecution;
    }

    /**
     *
     * @param bool $isExecuted
     *
     * @return $this
     */
    public function setIsExecuted($isExecuted)
    {
        $this->isExecuted = $isExecuted;

        return $this;
    }

    /**
     * @return bool
     */
    public function getIsExecuted()
    {
        return $this->isExecuted;
    }
}
