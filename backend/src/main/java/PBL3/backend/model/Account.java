package PBL3.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    private int idACC;

    @Column(name = "userACC")
    private String userACC;

    @Column(name = "passACC")
    private String passACC;

    @Column(name = "roleACC")
    private String roleACC;
    // Getters & Setters

    public String getUserACC() {
        return userACC;
    }

    public void setUserACC(String userACC) {
        this.userACC = userACC;
    }

    public String getPassACC() {
        return passACC;
    }

    public void setPassACC(String passACC) {
        this.passACC = passACC;
    }

    public String getRoleACC() {
        return roleACC;
    }

    public void setRoleACC(String roleACC) {
        this.roleACC = roleACC;
    }
}
